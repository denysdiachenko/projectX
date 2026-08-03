import { useRouter } from 'expo-router';

import AuthFlowScreen from '@/components/AuthFlowScreen/AuthFlowScreen';
import ForgotPasswordForm from '@/components/AuthFlowScreen/ForgotPasswordForm';
import { ROUTES } from '@/constants/routes';
import { useAppLocalization } from '@/hooks/app-localization';
import { showToast } from '@/services/toast';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { translations } = useAppLocalization();
  const copy = translations.forgotPassword;

  return (
    <AuthFlowScreen
      backLabel={copy.back}
      onBack={() => router.back()}
      subtitle={copy.subtitle}
      title={copy.title}>
      <ForgotPasswordForm
        onSent={(email) => {
          showToast({
            message: copy.sentMessage.replace('{email}', email),
            title: copy.sentTitle,
            type: 'success',
          });
          router.replace(ROUTES.login);
        }}
      />
    </AuthFlowScreen>
  );
}
