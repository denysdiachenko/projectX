import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export default function createStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    form: {
      marginTop: spacing.x2,
      gap: spacing.x4,
    },
    submitButton: {
      marginTop: spacing.x1,
    },
    divider: {
      height: spacing.x6,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x1,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border.default,
    },
    dividerLabel: {
      ...typography.caption,
      width: spacing.x12,
      color: colors.text.muted,
      textAlign: 'center',
    },
    loginRow: {
      minHeight: spacing.x6,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.x2,
    },
    loginPrompt: {
      ...typography.bodySmall,
      color: colors.text.secondary,
    },
    loginLink: {
      ...typography.bodySmall,
      fontFamily: theme.fontFamily.semiBold,
      color: colors.text.brand,
    },
    legal: {
      ...typography.caption,
      marginTop: -spacing.x4,
      color: colors.text.muted,
      textAlign: 'center',
    },
  });
}
