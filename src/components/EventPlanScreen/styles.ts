import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createEventPlanStyles(theme: AppTheme, contentBottomInset = 0) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background.surface,
    },
    scrollContent: {
      paddingHorizontal: spacing.x5,
      paddingTop: spacing.x4,
      paddingBottom: Math.max(spacing.x6, contentBottomInset + spacing.x4),
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
    venueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x2,
      marginTop: spacing.x2,
    },
    venueText: {
      ...typography.bodySmall,
      flex: 1,
      color: colors.text.secondary,
    },
    contextText: {
      ...typography.caption,
      marginTop: spacing.x3,
      paddingBottom: spacing.x4,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border.default,
      color: colors.text.muted,
    },
    section: {
      gap: spacing.x3,
      marginTop: spacing.x6,
    },
    sectionTitle: {
      ...typography.titleMedium,
      color: colors.text.primary,
    },
    targetCard: {
      overflow: 'hidden',
      paddingHorizontal: spacing.x4,
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: 18,
      backgroundColor: colors.background.surface,
      boxShadow: theme.name === 'dark'
        ? '0px 8px 20px 0px rgba(0, 0, 0, 0.24)'
        : '0px 8px 20px 0px rgba(33, 40, 59, 0.07)',
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
