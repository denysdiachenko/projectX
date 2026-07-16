import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createDeleteAccountSheetStyles(theme: AppTheme, bottomInset: number) {
  return StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: 'rgba(20, 24, 33, 0.48)',
    },
    backdropPressable: {
      flex: 1,
    },
    sheet: {
      paddingTop: theme.spacing.x3,
      paddingRight: theme.spacing.x6,
      paddingBottom: Math.max(bottomInset, theme.spacing.x8),
      paddingLeft: theme.spacing.x6,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      backgroundColor: theme.colors.background.surface,
    },
    handle: {
      alignSelf: 'center',
      width: theme.spacing.x12,
      height: theme.spacing.x1,
      borderRadius: theme.spacing.x1,
      backgroundColor: theme.colors.border.strong,
    },
    title: {
      ...theme.typography.titleLarge,
      marginTop: theme.spacing.x8,
      color: theme.colors.text.primary,
      textAlign: 'center',
    },
    body: {
      ...theme.typography.bodyMedium,
      marginTop: theme.spacing.x3,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    actions: {
      gap: theme.spacing.x3,
      marginTop: theme.spacing.x8,
    },
  });
}
