import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createMyEventsStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background.canvas,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing.x6,
      paddingTop: spacing.x12,
      paddingBottom: spacing.x4,
    },
    title: {
      ...typography.heading2,
      color: colors.text.primary,
    },
    greeting: {
      ...typography.bodySmall,
      marginTop: spacing.x1,
      color: colors.text.secondary,
    },
    illustration: {
      position: 'relative',
      width: 264,
      height: 237,
      alignSelf: 'center',
      marginTop: 44,
      boxShadow: `10px 10px 24px 0px ${colors.border.default}`,
      borderRadius: 32,
    },
    illustrationAsset: {
      position: 'absolute',
      top: -16,
      left: -28,
      width: 320,
      height: 293,
    },
    emptyTitle: {
      ...typography.heading3,
      marginTop: spacing.x8,
      color: colors.text.primary,
      textAlign: 'center',
    },
    emptyBody: {
      ...typography.bodyMedium,
      maxWidth: 302,
      alignSelf: 'center',
      marginTop: spacing.x3,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    createButton: {
      marginTop: spacing.x6,
    },
    hint: {
      minHeight: 88,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.x6,
      paddingHorizontal: spacing.x4,
      borderRadius: 18,
      backgroundColor: colors.background.subtle,
    },
    hintIcon: {
      width: spacing.x10,
      height: spacing.x10,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.x3,
    },
    hintCopy: {
      flex: 1,
    },
    hintTitle: {
      ...typography.titleMedium,
      color: colors.text.primary,
    },
    hintBody: {
      ...typography.bodySmall,
      marginTop: spacing.x1,
      color: colors.text.secondary,
    },
  });
}
