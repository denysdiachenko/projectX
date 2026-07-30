import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import AppButton from '@/components/AppButton/AppButton';
import AuthFlowScreen from '@/components/AuthFlowScreen/AuthFlowScreen';
import { createAuthFlowScreenStyles } from '@/components/AuthFlowScreen/styles';
import { ROUTES } from '@/constants/routes';
import { getStringRouteParam } from '@/helpers/getStringRouteParam';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import {
  isAccountPasswordError,
  resendEmailConfirmation,
} from '@/services/auth';
import { showToast } from '@/services/toast';

export default function EmailConfirmationScreen() {
  const params = useLocalSearchParams<{ email?: string | string[] }>();
  const email = getStringRouteParam(params.email);
  const router = useRouter();
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.emailConfirmation;
  const styles = useMemo(() => createAuthFlowScreenStyles(theme), [theme]);
  const [resending, setResending] = useState(false);

  const resend = async () => {
    if (!email || resending) return;
    setResending(true);

    try {
      await resendEmailConfirmation(email);
      showToast({
        message: copy.resendSuccessMessage,
        title: copy.resendSuccessTitle,
        type: 'success',
      });
    } catch (error) {
      const errorCode = isAccountPasswordError(error) ? error.code : 'unknown';
      const message = errorCode === 'invalidEmail'
        || errorCode === 'network'
        || errorCode === 'rateLimited'
        ? copy.errors[errorCode]
        : copy.errors.unknown;

      showToast({
        message,
        title: copy.resendErrorTitle,
        type: 'error',
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthFlowScreen
      backLabel={copy.back}
      onBack={() => router.back()}
      subtitle={copy.subtitle}
      title={copy.title}>
      <View style={styles.confirmation}>
        <Text style={styles.confirmationEmail}>
          {copy.emailSentTo.replace('{email}', email || '—')}
        </Text>
        <View style={styles.actions}>
          <AppButton
            disabled={!email || resending}
            label={resending ? copy.resending : copy.resend}
            loading={resending}
            onPress={() => void resend()}
          />
          <AppButton
            label={copy.goToLogin}
            onPress={() => router.replace(ROUTES.login)}
            variant="secondary"
          />
        </View>
      </View>
    </AuthFlowScreen>
  );
}
