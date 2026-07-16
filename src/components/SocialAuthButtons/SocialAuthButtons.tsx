import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import AppButton from '@/components/AppButton/AppButton';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import createStyles from './styles';

type SocialAuthButtonsProps = {
  onGooglePress: () => void;
  onApplePress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function SocialAuthButtons({
  onGooglePress,
  onApplePress,
  disabled = false,
  style,
}: SocialAuthButtonsProps) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const copy = translations.common.socialAuth;

  return (
    <View style={[styles.container, style]}>
      <AppButton
        disabled={disabled}
        icon={<AntDesign name="google" color={theme.colors.text.primary} size={20} />}
        label={copy.continueWithGoogle}
        onPress={onGooglePress}
        variant="social"
      />
      <AppButton
        disabled={disabled}
        icon={<AntDesign name="apple" color={theme.colors.text.primary} size={20} />}
        label={copy.continueWithApple}
        onPress={onApplePress}
        variant="social"
      />
    </View>
  );
}
