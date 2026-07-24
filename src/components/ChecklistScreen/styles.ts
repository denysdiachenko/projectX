import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createChecklistStyles(
  theme: AppTheme,
  bottomInset = 0,
  contentBottomInset = 0,
) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background.canvas,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing.x5,
      paddingTop: spacing.x4,
      paddingBottom: Math.max(spacing.x8, contentBottomInset + spacing.x4),
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.x4,
    },
    title: {
      ...typography.heading3,
      flex: 1,
      color: colors.text.primary,
    },
    addButton: {
      minHeight: spacing.x10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x2,
      paddingHorizontal: spacing.x1,
      borderRadius: spacing.x2,
    },
    addButtonLabel: {
      ...typography.bodySmall,
      color: colors.text.brand,
    },
    pressed: {
      opacity: 0.64,
    },
    summary: {
      minHeight: 88,
      gap: spacing.x3,
      marginTop: spacing.x3,
      padding: spacing.x4,
      borderRadius: spacing.x4,
      backgroundColor: colors.status.successBackground,
    },
    summaryTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x3,
    },
    summaryIcon: {
      width: spacing.x10,
      height: spacing.x10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: spacing.x5,
      backgroundColor: colors.background.brand,
    },
    summaryCopy: {
      flex: 1,
      gap: spacing.x1,
    },
    summaryTitle: {
      ...typography.labelLarge,
      color: colors.text.primary,
    },
    summaryValue: {
      ...typography.caption,
      color: colors.text.secondary,
    },
    progressTrack: {
      height: spacing.x1,
      overflow: 'hidden',
      borderRadius: 2,
      backgroundColor: colors.border.default,
    },
    progressValue: {
      height: '100%',
      borderRadius: 2,
      backgroundColor: colors.background.brand,
    },
    section: {
      marginTop: spacing.x5,
    },
    sectionTitle: {
      ...typography.labelLarge,
      marginBottom: spacing.x3,
      color: colors.text.primary,
    },
    itemsCard: {
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: spacing.x4,
      backgroundColor: colors.background.surface,
    },
    itemRow: {
      minHeight: 56,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x3,
      marginHorizontal: spacing.x4,
    },
    itemDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border.default,
    },
    checkbox: {
      width: spacing.x6,
      height: spacing.x6,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: colors.border.strong,
      borderRadius: 6,
      backgroundColor: colors.background.surface,
    },
    checkboxChecked: {
      borderColor: colors.background.brand,
      backgroundColor: colors.background.brand,
    },
    itemTitle: {
      ...typography.bodySmall,
      flex: 1,
      color: colors.text.primary,
    },
    itemTitleCompleted: {
      color: colors.text.muted,
      textDecorationLine: 'line-through',
    },
    itemMenu: {
      width: spacing.x8,
      height: spacing.x8,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: spacing.x4,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      paddingTop: spacing.x16,
      paddingHorizontal: spacing.x6,
    },
    emptyIcon: {
      width: 120,
      height: 120,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 60,
      backgroundColor: colors.background.accentSubtle,
    },
    emptyTitle: {
      ...typography.titleLarge,
      marginTop: spacing.x6,
      color: colors.text.primary,
      textAlign: 'center',
    },
    emptyBody: {
      ...typography.bodySmall,
      marginTop: spacing.x2,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    emptyButton: {
      width: '100%',
      marginTop: spacing.x8,
    },
    state: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.x4,
      paddingHorizontal: spacing.x6,
    },
    stateText: {
      ...typography.titleLarge,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    retryButton: {
      minWidth: 180,
    },
    modalRoot: {
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
    keyboardView: {
      justifyContent: 'flex-end',
    },
    sheet: {
      paddingTop: spacing.x3,
      paddingBottom: Math.max(bottomInset, spacing.x4),
      borderTopLeftRadius: spacing.x6,
      borderTopRightRadius: spacing.x6,
      backgroundColor: colors.background.surface,
    },
    handle: {
      width: spacing.x12,
      height: spacing.x1,
      alignSelf: 'center',
      borderRadius: spacing.x1,
      backgroundColor: colors.border.default,
    },
    formContent: {
      gap: spacing.x5,
      paddingHorizontal: spacing.x5,
      paddingTop: spacing.x5,
      paddingBottom: spacing.x4,
    },
    formTitle: {
      ...typography.titleLarge,
      color: colors.text.primary,
    },
    formActions: {
      gap: spacing.x3,
      marginTop: spacing.x2,
    },
  });
}
