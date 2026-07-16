import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export default function createStyles(theme: AppTheme) {
  const { colors, fontFamily, spacing, typography } = theme;

  return StyleSheet.create({
    container: {
      gap: spacing.x1,
    },
    label: {
      ...typography.bodySmall,
      fontFamily: fontFamily.semiBold,
      color: colors.text.primary,
    },
    field: {
      height: 56,
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: 14,
      backgroundColor: colors.background.surface,
      justifyContent: 'center',
    },
    focusedField: {
      borderColor: colors.border.brand,
    },
    readOnlyField: {
      backgroundColor: colors.background.subtle,
    },
    errorField: {
      borderColor: colors.status.errorForeground,
    },
    input: {
      ...typography.labelLarge,
      height: '100%',
      paddingHorizontal: spacing.x4,
      color: colors.text.primary,
      fontFamily: fontFamily.regular,
    },
    inputWithAction: {
      paddingRight: 104,
    },
    readOnlyInput: {
      color: colors.text.secondary,
    },
    action: {
      position: 'absolute',
      right: spacing.x4,
      justifyContent: 'center',
      height: '100%',
    },
    actionLabel: {
      ...typography.labelSmall,
      color: colors.text.brand,
      letterSpacing: 0,
    },
    endAdornment: {
      position: 'absolute',
      right: spacing.x4,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    },
    errorLabel: {
      ...typography.caption,
      color: colors.status.errorForeground,
    },
  });
}
