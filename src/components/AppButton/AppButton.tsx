import { useMemo, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import createStyles from './styles';

export type AppButtonVariant = 'primary' | 'secondary' | 'destructive' | 'social';

export type AppButtonProps = {
  label: string;
  variant?: AppButtonVariant;
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
};

const AppButton = ({
  label,
  variant = 'primary',
  icon,
  disabled = false,
  loading = false,
  onPress,
  style,
  labelStyle,
  accessibilityLabel,
}: AppButtonProps) => {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const isDisabled = disabled || loading;
  const indicatorColors: Record<AppButtonVariant, string> = {
    primary: theme.colors.text.onBrand,
    secondary: theme.colors.text.onSecondary,
    destructive: theme.colors.status.errorForeground,
    social: theme.colors.text.primary,
  };
  const indicatorColor = isDisabled
    ? theme.colors.text.muted
    : indicatorColors[variant];

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[`${variant}Button`],
        pressed && !isDisabled && styles[`${variant}ButtonPressed`],
        isDisabled && styles.buttonDisabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={indicatorColor} size="small" />
      ) : (
        icon
      )}
      <Text
        style={[
          styles.buttonLabel,
          styles[`${variant}ButtonLabel`],
          isDisabled && styles.buttonLabelDisabled,
          labelStyle,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
};

export default AppButton;
