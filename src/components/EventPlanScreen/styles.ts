import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createEventPlanStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background.canvas,
    },
    scrollContent: {
      paddingHorizontal: spacing.x5,
      paddingTop: spacing.x4,
      paddingBottom: spacing.x6,
    },
    title: {
      ...typography.heading3,
      color: colors.text.primary,
    },
    meta: {
      ...typography.bodySmall,
      marginTop: spacing.x1,
      color: colors.text.secondary,
    },
    readyCard: {
      minHeight: 82,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x3,
      marginTop: spacing.x5,
      paddingHorizontal: spacing.x4,
      borderRadius: 18,
      backgroundColor: colors.status.successBackground,
    },
    readyIcon: {
      width: spacing.x10,
      height: spacing.x10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    readyCopy: {
      flex: 1,
      gap: spacing.x1,
    },
    readyTitle: {
      ...typography.titleMedium,
      color: colors.text.primary,
    },
    readyMessage: {
      ...typography.caption,
      color: colors.text.secondary,
    },
    contextCard: {
      minHeight: 62,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x3,
      marginTop: spacing.x3,
      paddingHorizontal: spacing.x4,
      borderRadius: spacing.x4,
      backgroundColor: colors.status.infoBackground,
    },
    contextText: {
      ...typography.caption,
      flex: 1,
      color: colors.text.secondary,
    },
    section: {
      gap: spacing.x3,
      marginTop: spacing.x5,
    },
    sectionTitle: {
      ...typography.titleMedium,
      color: colors.text.primary,
    },
    targetCard: {
      paddingHorizontal: spacing.x4,
      borderRadius: 18,
      backgroundColor: colors.background.surface,
    },
    targetRow: {
      minHeight: 46,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.x3,
    },
    targetLabel: {
      ...typography.bodySmall,
      flex: 1,
      color: colors.text.secondary,
    },
    targetValue: {
      ...typography.labelSmall,
      letterSpacing: 0,
      color: colors.text.primary,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border.default,
    },
    productsNote: {
      minHeight: 82,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x3,
      marginTop: spacing.x5,
      paddingHorizontal: spacing.x4,
      borderRadius: spacing.x4,
      backgroundColor: colors.background.accentSubtle,
    },
    productsNoteCopy: {
      flex: 1,
      gap: spacing.x1,
    },
    productsNoteTitle: {
      ...typography.labelLarge,
      color: colors.text.primary,
    },
    productsNoteBody: {
      ...typography.caption,
      color: colors.text.secondary,
    },
    state: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.x4,
      paddingHorizontal: spacing.x6,
    },
    errorText: {
      ...typography.bodyMedium,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    retryButton: {
      minWidth: 180,
    },
    placeholderIcon: {
      width: spacing.x16,
      height: spacing.x16,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: spacing.x8,
      backgroundColor: colors.background.subtle,
    },
    placeholderTitle: {
      ...typography.heading3,
      color: colors.text.primary,
      textAlign: 'center',
    },
  });
}
