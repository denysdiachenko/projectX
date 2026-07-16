import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export default function createStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    form: {
      marginTop: spacing.x2,
    },
    passwordField: {
      marginTop: spacing.x5,
    },
    forgotPassword: {
      marginTop: spacing.x2,
      minHeight: spacing.x5,
      alignSelf: 'flex-end',
      justifyContent: 'center',
    },
    forgotPasswordLabel: {
      ...typography.bodySmall,
      fontFamily: theme.fontFamily.semiBold,
      color: colors.text.brand,
    },
    loginButton: {
      marginTop: spacing.x5,
    },
    divider: {
      marginTop: 22,
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
      textAlign: 'center',
      color: colors.text.muted,
    },
    socialActions: {
      marginTop: spacing.x3,
      gap: spacing.x3,
    },
    createAccountRow: {
      marginTop: spacing.x8,
      minHeight: spacing.x6,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.x2,
    },
    createAccountPrompt: {
      ...typography.bodySmall,
      color: colors.text.secondary,
    },
    createAccountLink: {
      ...typography.bodySmall,
      fontFamily: theme.fontFamily.semiBold,
      color: colors.text.brand,
    },
    securityNote: {
      ...typography.caption,
      maxWidth: 310,
      marginTop: spacing.x6,
      alignSelf: 'center',
      color: colors.text.muted,
      textAlign: 'center',
    },
  });
}
