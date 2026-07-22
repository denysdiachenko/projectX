import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createMyEventsStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background.canvas,
    },
    list: {
      flex: 1,
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
    eventsList: {
      gap: spacing.x3,
      marginTop: spacing.x6,
    },
    eventCard: {
      minHeight: 96,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x3,
      padding: spacing.x4,
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: spacing.x4,
      backgroundColor: colors.background.surface,
    },
    eventCardPressed: {
      opacity: 0.72,
    },
    eventIcon: {
      width: spacing.x12,
      height: spacing.x12,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: spacing.x3,
      backgroundColor: colors.background.subtle,
    },
    eventCopy: {
      flex: 1,
      gap: 2,
    },
    eventTitle: {
      ...typography.titleMedium,
      color: colors.text.primary,
    },
    eventDate: {
      ...typography.bodySmall,
      color: colors.text.secondary,
    },
    eventGuests: {
      ...typography.caption,
      color: colors.text.muted,
    },
    listState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.x3,
      paddingVertical: spacing.x12,
    },
    listError: {
      ...typography.bodySmall,
      color: colors.status.errorForeground,
      textAlign: 'center',
    },
    retryButton: {
      minWidth: 160,
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
    bottomAction: {
      paddingHorizontal: spacing.x6,
      paddingTop: spacing.x3,
      paddingBottom: spacing.x4,
      backgroundColor: colors.background.canvas,
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
