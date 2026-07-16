import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export default function createStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    button: {
      height: 52,
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.x4,
      gap: spacing.x2,
    },
    primaryButton: {
      backgroundColor: colors.action.primary,
    },
    primaryButtonPressed: {
      backgroundColor: colors.action.primaryPressed,
    },
    primaryButtonLabel: {
      color: colors.text.onBrand,
    },
    secondaryButton: {
      backgroundColor: colors.action.secondary,
    },
    secondaryButtonPressed: {
      backgroundColor: colors.action.secondaryPressed,
    },
    secondaryButtonLabel: {
      color: colors.text.onSecondary,
    },
    destructiveButton: {
      backgroundColor: colors.status.errorBackground,
      borderWidth: 1,
      borderColor: colors.status.errorForeground,
    },
    destructiveButtonPressed: {
      opacity: 0.76,
    },
    destructiveButtonLabel: {
      color: colors.status.errorForeground,
    },
    socialButton: {
      backgroundColor: colors.action.social,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    socialButtonPressed: {
      backgroundColor: colors.action.socialPressed,
    },
    socialButtonLabel: {
      color: colors.text.primary,
    },
    buttonDisabled: {
      backgroundColor: colors.action.disabled,
      borderWidth: 0,
    },
    buttonLabel: {
      ...typography.labelLarge,
    },
    buttonLabelDisabled: {
      color: colors.text.muted,
    },
  });
}
