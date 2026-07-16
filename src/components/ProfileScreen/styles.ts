import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createProfileStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background.canvas,
    },
    scrollContent: {
      paddingHorizontal: spacing.x6,
      paddingTop: spacing.x3,
      paddingBottom: spacing.x6,
    },
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    identity: {
      alignItems: 'center',
    },
    name: {
      ...typography.titleLarge,
      marginTop: spacing.x2,
      color: colors.text.primary,
      textAlign: 'center',
    },
    email: {
      ...typography.bodySmall,
      marginTop: spacing.x1,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    editButton: {
      marginTop: spacing.x3,
    },
    section: {
      marginTop: spacing.x4,
    },
    sectionLabel: {
      ...typography.labelSmall,
      marginBottom: spacing.x3,
      color: colors.text.muted,
      textTransform: 'uppercase',
    },
    group: {
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: spacing.x4,
      backgroundColor: colors.background.surface,
    },
    deleteButton: {
      marginTop: spacing.x3,
    },
  });
}
