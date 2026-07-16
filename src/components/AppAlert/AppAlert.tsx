import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import createStyles, { getAlertPalette } from './styles';

export type AppAlertVariant = 'success' | 'warning' | 'error' | 'info';

type AppAlertContentProps = {
  message: string;
  title?: string;
  variant?: AppAlertVariant;
};

type AppAlertProps = AppAlertContentProps &
  (
    | { dismissLabel?: never; onDismiss?: never }
    | { dismissLabel: string; onDismiss: () => void }
  );

const variantIcons = {
  success: 'check-circle',
  warning: 'exclamation-circle',
  error: 'close-circle',
  info: 'info-circle',
} as const;

export default function AppAlert({
  message,
  title,
  variant = 'info',
  dismissLabel,
  onDismiss,
}: AppAlertProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const palette = getAlertPalette(theme, variant);

  return (
    <View
      accessibilityLiveRegion={variant === 'error' ? 'assertive' : 'polite'}
      accessibilityRole="alert"
      style={[
        styles.container,
        {
          backgroundColor: palette.background,
          borderColor: palette.foreground,
        },
      ]}
    >
      <AntDesign
        color={palette.foreground}
        name={variantIcons[variant]}
        size={24}
      />

      <View style={styles.content}>
        {title ? (
          <Text style={[styles.title, { color: palette.foreground }]}>{title}</Text>
        ) : null}
        <Text style={[styles.message, { color: palette.foreground }]}>{message}</Text>
      </View>

      {onDismiss ? (
        <Pressable
          accessibilityLabel={dismissLabel}
          accessibilityRole="button"
          hitSlop={theme.spacing.x2}
          onPress={onDismiss}
          style={({ pressed }) => [styles.dismissButton, pressed && styles.pressed]}
        >
          <AntDesign color={palette.foreground} name="close" size={24} />
        </Pressable>
      ) : null}
    </View>
  );
}
