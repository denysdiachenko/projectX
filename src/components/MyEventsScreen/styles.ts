import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createMyEventsStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background.canvas,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.x6,
      paddingTop: spacing.x6,
    },
    title: {
      ...typography.heading2,
      color: colors.text.primary,
    },
    placeholder: {
      ...typography.bodyMedium,
      marginTop: spacing.x2,
      color: colors.text.secondary,
    },
  });
}
