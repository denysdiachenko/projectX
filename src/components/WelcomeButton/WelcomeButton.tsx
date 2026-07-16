import { ActivityIndicator, Pressable, Text } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import createStyles from './styles';

type WelcomeButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
};

const WelcomeButton = ({
  label,
  variant = 'secondary',
  icon,
  disabled = false,
  loading = false,
  onPress,
}: WelcomeButtonProps) => {
  const theme = useAppTheme();
  const primary = variant === 'primary';
  const styles = createStyles(theme);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        primary ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={primary ? theme.colors.text.onBrand : theme.colors.text.primary}
          size="small"
        />
      ) : (
        icon
      )}
      <Text style={[styles.buttonLabel, primary && styles.primaryButtonLabel]}>{label}</Text>
    </Pressable>
  );
};

export default WelcomeButton;
