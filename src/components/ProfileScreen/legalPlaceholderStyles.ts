import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createLegalPlaceholderStyles(theme: AppTheme) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background.canvas,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: theme.spacing.x8,
      paddingTop: 128,
    },
    illustration: {
      width: 128,
      height: 128,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.spacing.x8,
      backgroundColor: theme.colors.background.subtle,
    },
    document: {
      width: 66,
      height: 82,
    },
    title: {
      ...theme.typography.titleLarge,
      marginTop: theme.spacing.x8,
      color: theme.colors.text.primary,
      textAlign: 'center',
    },
    message: {
      ...theme.typography.bodyMedium,
      maxWidth: 306,
      marginTop: theme.spacing.x3,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
  });
}
