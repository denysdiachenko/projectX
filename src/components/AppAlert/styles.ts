import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

import type { AppAlertVariant } from './AppAlert';

export function getAlertPalette(theme: AppTheme, variant: AppAlertVariant) {
  const { status } = theme.colors;

  switch (variant) {
    case 'success':
      return {
        background: status.successBackground,
        foreground: status.successForeground,
      };
    case 'warning':
      return {
        background: status.warningBackground,
        foreground: status.warningForeground,
      };
    case 'error':
      return {
        background: status.errorBackground,
        foreground: status.errorForeground,
      };
    case 'info':
      return {
        background: status.infoBackground,
        foreground: status.infoForeground,
      };
  }
}

export default function createStyles(theme: AppTheme) {
  const { spacing, typography } = theme;

  return StyleSheet.create({
    container: {
      minHeight: spacing.x16 + spacing.x2,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x2,
      padding: spacing.x3,
      borderRadius: spacing.x3,
      borderWidth: 1,
      shadowColor: theme.primitives.neutral[900],
      shadowOffset: {
        width: 0,
        height: spacing.x2,
      },
      shadowOpacity: theme.name === 'dark' ? 0.24 : 0.12,
      shadowRadius: spacing.x2 + spacing.x1 / 2,
      elevation: theme.name === 'dark' ? spacing.x3 : spacing.x2,
    },
    content: {
      flex: 1,
    },
    title: {
      ...typography.bodySmall,
      fontFamily: theme.fontFamily.semiBold,
    },
    message: {
      ...typography.bodySmall,
      opacity: 0.78,
    },
    dismissButton: {
      width: spacing.x6,
      height: spacing.x6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: {
      opacity: 0.6,
    },
  });
}
