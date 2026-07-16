import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo, useState } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import AppButton from '@/components/AppButton/AppButton';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import {
  isSocialAuthError,
  signInWithGoogle,
  type SocialAuthErrorCode,
} from '@/services/social-auth';
import { showToast } from '@/services/toast';

import createStyles from './styles';

type SocialAuthButtonsProps = {
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function SocialAuthButtons({
  disabled = false,
  style,
}: SocialAuthButtonsProps) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const copy = translations.common.socialAuth;
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const isDisabled = disabled || isGoogleLoading;

  const handleGooglePress = async () => {
    setIsGoogleLoading(true);

    try {
      await signInWithGoogle();
    } catch (error) {
      const errorCode: SocialAuthErrorCode = isSocialAuthError(error)
        ? error.code
        : 'unknown';

      showToast({
        message: copy.errors[errorCode],
        title: copy.googleErrorTitle,
        type: 'error',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleApplePress = () => {
    showToast({
      message: copy.appleUnavailableMessage,
      title: copy.appleUnavailableTitle,
      type: 'info',
    });
  };

  return (
    <View style={[styles.container, style]}>
      <AppButton
        disabled={isDisabled}
        icon={<AntDesign name="google" color={theme.colors.text.primary} size={20} />}
        label={copy.continueWithGoogle}
        loading={isGoogleLoading}
        onPress={handleGooglePress}
        variant="social"
      />
      <AppButton
        disabled={isDisabled}
        icon={<AntDesign name="apple" color={theme.colors.text.primary} size={20} />}
        label={copy.continueWithApple}
        onPress={handleApplePress}
        variant="social"
      />
    </View>
  );
}
