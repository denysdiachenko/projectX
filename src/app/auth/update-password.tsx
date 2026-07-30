import { AntDesign } from '@react-native-vector-icons/ant-design';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import AppButton from '@/components/AppButton/AppButton';
import AuthFlowScreen from '@/components/AuthFlowScreen/AuthFlowScreen';
import ChangePasswordForm from '@/components/AuthFlowScreen/ChangePasswordForm';
import { createAuthFlowScreenStyles } from '@/components/AuthFlowScreen/styles';
import { ROUTES } from '@/constants/routes';
import { getStringRouteParam } from '@/helpers/getStringRouteParam';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { createSessionFromAuthUrl } from '@/services/auth-callback';

type RecoveryState = 'failed' | 'loading' | 'ready';

export default function UpdatePasswordScreen() {
  const params = useLocalSearchParams<{ recovery?: string | string[] }>();
  const isRecovery = getStringRouteParam(params.recovery) === '1';
  const callbackUrl = Linking.useURL();
  const router = useRouter();
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.changePassword;
  const styles = useMemo(() => createAuthFlowScreenStyles(theme), [theme]);
  const handled = useRef(false);
  const [recoveryState, setRecoveryState] = useState<RecoveryState>(
    isRecovery ? 'loading' : 'ready',
  );

  useEffect(() => {
    if (!isRecovery || handled.current) return;
    handled.current = true;

    void (async () => {
      try {
        const url = callbackUrl ?? await Linking.getInitialURL();
        if (!url) throw new Error('Password recovery URL is missing');

        await createSessionFromAuthUrl(url);
        setRecoveryState('ready');
      } catch {
        setRecoveryState('failed');
      }
    })();
  }, [callbackUrl, isRecovery]);

  if (recoveryState !== 'ready') {
    return (
      <View style={styles.state}>
        <StatusBar style={theme.statusBar} />
        <View style={styles.stateIcon}>
          {recoveryState === 'loading' ? (
            <ActivityIndicator color={theme.colors.background.accent} size="large" />
          ) : (
            <AntDesign
              color={theme.colors.status.errorForeground}
              name="close-circle"
              size={30}
            />
          )}
        </View>
        <Text style={styles.stateTitle}>
          {recoveryState === 'loading'
            ? copy.recoveryTitle
            : copy.invalidLinkTitle}
        </Text>
        {recoveryState === 'failed' ? (
          <>
            <Text style={styles.stateMessage}>{copy.invalidLinkMessage}</Text>
            <AppButton
              label={copy.goToLogin}
              onPress={() => router.replace(ROUTES.login)}
              style={styles.stateButton}
            />
          </>
        ) : null}
      </View>
    );
  }

  return (
    <AuthFlowScreen
      backLabel={copy.back}
      onBack={() => isRecovery ? router.replace(ROUTES.login) : router.back()}
      subtitle={isRecovery ? copy.recoverySubtitle : copy.subtitle}
      title={isRecovery ? copy.recoveryTitle : copy.title}>
      <ChangePasswordForm
        requireCurrentPassword={!isRecovery}
        onSaved={() => {
          if (isRecovery) {
            router.replace(ROUTES.myEvents);
          } else {
            router.back();
          }
        }}
      />
    </AuthFlowScreen>
  );
}
