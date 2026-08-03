import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createInvitationStyles(theme: AppTheme) {
  return StyleSheet.create({
    screen: {
      alignItems: 'center',
      backgroundColor: theme.colors.background.canvas,
      flex: 1,
      justifyContent: 'center',
      padding: theme.spacing.x6,
    },
    card: {
      backgroundColor: theme.colors.background.surface,
      borderRadius: theme.spacing.x6,
      gap: theme.spacing.x3,
      maxWidth: 520,
      padding: theme.spacing.x6,
      width: '100%',
    },
    eyebrow: {
      ...theme.typography.overline,
      color: theme.colors.text.brand,
    },
    title: {
      ...theme.typography.heading2,
      color: theme.colors.text.primary,
    },
    message: {
      ...theme.typography.bodySmall,
      color: theme.colors.text.secondary,
    },
  });
}
