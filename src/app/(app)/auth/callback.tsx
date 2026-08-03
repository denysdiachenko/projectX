import { AntDesign } from '@react-native-vector-icons/ant-design';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import AppButton from '@/components/AppButton/AppButton';
import { createAuthFlowScreenStyles } from '@/components/AuthFlowScreen/styles';
import { ROUTES } from '@/constants/routes';
import { useAppAuth } from '@/hooks/app-auth';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { createSessionFromAuthUrl } from '@/services/auth-callback';
import { showToast } from '@/services/toast';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const { session } = useAppAuth();
  const callbackUrl = Linking.useURL();
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.authCallback;
  const styles = useMemo(() => createAuthFlowScreenStyles(theme), [theme]);
  const handled = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (handled.current) return;

    if (session) {
      handled.current = true;
      router.replace(ROUTES.myEvents);
      return;
    }

    handled.current = true;

    void (async () => {
      try {
        const url = callbackUrl ?? await Linking.getInitialURL();
        if (!url) throw new Error('Auth callback URL is missing');

        await createSessionFromAuthUrl(url);
        showToast({
          message: copy.successMessage,
          title: copy.successTitle,
          type: 'success',
        });
        router.replace(ROUTES.myEvents);
      } catch {
        setFailed(true);
      }
    })();
  }, [
    callbackUrl,
    copy.successMessage,
    copy.successTitle,
    router,
    session,
  ]);

  return (
    <View style={styles.state}>
      <StatusBar style={theme.statusBar} />
      <View style={styles.stateIcon}>
        {failed ? (
          <AntDesign
            color={theme.colors.status.errorForeground}
            name="close-circle"
            size={30}
          />
        ) : (
          <ActivityIndicator color={theme.colors.background.accent} size="large" />
        )}
      </View>
      <Text style={styles.stateTitle}>
        {failed ? copy.errorTitle : copy.confirming}
      </Text>
      {failed ? (
        <>
          <Text style={styles.stateMessage}>{copy.errorMessage}</Text>
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
