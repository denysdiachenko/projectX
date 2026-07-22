import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createShoppingListStyles(theme: AppTheme, bottomInset = 0) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background.canvas,
    },
    scrollContent: {
      paddingHorizontal: spacing.x5,
      paddingTop: spacing.x4,
      paddingBottom: spacing.x8,
    },
    title: {
      ...typography.heading3,
      color: colors.text.primary,
    },
    summary: {
      minHeight: 72,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x3,
      marginTop: spacing.x4,
      paddingHorizontal: spacing.x4,
      borderRadius: spacing.x4,
      backgroundColor: colors.background.subtle,
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
    summaryProgress: {
      ...typography.bodySmall,
      color: colors.text.secondary,
    },
    viewToggle: {
      flexDirection: 'row',
      gap: spacing.x1,
      marginTop: spacing.x4,
      padding: spacing.x1,
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: spacing.x3,
      backgroundColor: colors.background.surface,
    },
    viewToggleButton: {
      minHeight: spacing.x10,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.x2,
      paddingHorizontal: spacing.x2,
      borderRadius: spacing.x2,
    },
    viewToggleButtonSelected: {
      backgroundColor: colors.background.subtle,
    },
    viewToggleLabel: {
      ...typography.labelSmall,
      color: colors.text.secondary,
      letterSpacing: 0,
    },
    viewToggleLabelSelected: {
      color: colors.text.brand,
    },
    section: {
      marginTop: spacing.x5,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: spacing.x4,
      backgroundColor: colors.background.surface,
    },
    sectionHeader: {
      padding: spacing.x4,
      backgroundColor: colors.background.surface,
    },
    sectionHeaderTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.x3,
    },
    sectionTitle: {
      ...typography.titleMedium,
      flex: 1,
      color: colors.text.primary,
    },
    addButton: {
      minHeight: spacing.x8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x1,
      paddingHorizontal: spacing.x2,
      borderRadius: spacing.x2,
    },
    pressed: {
      opacity: 0.64,
    },
    addButtonLabel: {
      ...typography.labelSmall,
      color: colors.text.brand,
      letterSpacing: 0,
    },
    targetProgress: {
      ...typography.caption,
      marginTop: spacing.x2,
      color: colors.text.secondary,
    },
    progressTrack: {
      height: spacing.x1,
      overflow: 'hidden',
      marginTop: spacing.x2,
      borderRadius: spacing.x1,
      backgroundColor: colors.border.default,
    },
    progressValue: {
      height: '100%',
      borderRadius: spacing.x1,
      backgroundColor: colors.background.brand,
    },
    noItems: {
      ...typography.bodySmall,
      paddingHorizontal: spacing.x4,
      paddingBottom: spacing.x4,
      color: colors.text.muted,
    },
    itemRow: {
      minHeight: 68,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x3,
      paddingHorizontal: spacing.x4,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border.default,
    },
    checkbox: {
      width: spacing.x6,
      height: spacing.x6,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: colors.border.strong,
      borderRadius: spacing.x1,
    },
    checkboxChecked: {
      borderColor: colors.background.brand,
      backgroundColor: colors.background.brand,
    },
    itemCopy: {
      flex: 1,
      gap: 2,
    },
    itemName: {
      ...typography.bodyMedium,
      color: colors.text.primary,
    },
    itemNamePurchased: {
      color: colors.text.muted,
      textDecorationLine: 'line-through',
    },
    itemMeta: {
      ...typography.caption,
      color: colors.text.secondary,
    },
    itemActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x1,
    },
    iconButton: {
      width: spacing.x8,
      height: spacing.x8,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: spacing.x4,
    },
    previousBody: {
      ...typography.caption,
      marginTop: spacing.x1,
      color: colors.text.secondary,
    },
    state: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.x4,
      paddingHorizontal: spacing.x6,
    },
    stateTitle: {
      ...typography.titleLarge,
      color: colors.text.primary,
      textAlign: 'center',
    },
    stateBody: {
      ...typography.bodySmall,
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
      maxHeight: '92%',
      paddingTop: spacing.x3,
      paddingBottom: Math.max(bottomInset, spacing.x4),
      borderTopLeftRadius: spacing.x6,
      borderTopRightRadius: spacing.x6,
      backgroundColor: colors.background.surface,
    },
    handle: {
      width: spacing.x10,
      height: spacing.x1,
      alignSelf: 'center',
      borderRadius: spacing.x1,
      backgroundColor: colors.border.default,
    },
    formScroll: {
      paddingHorizontal: spacing.x6,
      paddingTop: spacing.x5,
      paddingBottom: spacing.x4,
    },
    formTitle: {
      ...typography.titleLarge,
      color: colors.text.primary,
    },
    categoryLabel: {
      ...typography.labelSmall,
      marginTop: spacing.x2,
      color: colors.text.brand,
      letterSpacing: 0,
    },
    formFields: {
      gap: spacing.x4,
      marginTop: spacing.x5,
    },
    quantityRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.x3,
    },
    quantityField: {
      flex: 1,
    },
    packageHeader: {
      gap: spacing.x1,
    },
    packageTitle: {
      ...typography.labelLarge,
      color: colors.text.primary,
    },
    packageHint: {
      ...typography.caption,
      color: colors.text.secondary,
    },
    packageFields: {
      flexDirection: 'row',
      gap: spacing.x3,
    },
    packageField: {
      flex: 1,
    },
    formActions: {
      gap: spacing.x3,
      marginTop: spacing.x2,
    },
  });
}
