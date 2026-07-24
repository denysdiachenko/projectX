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
      marginTop: spacing.x4,
    },
    eventCard: {
      position: 'relative',
      minHeight: 148,
      overflow: 'hidden',
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.x4,
      padding: 14,
      borderWidth: 1,
      borderRadius: spacing.x4,
    },
    eventCardCompact: {
      flex: 1,
      minHeight: 118,
      gap: spacing.x2,
      padding: spacing.x3,
      borderRadius: spacing.x4,
    },
    eventCardAccent: {
      borderColor:
        theme.name === 'dark' ? theme.primitives.violet[500] : theme.primitives.violet[300],
      backgroundColor:
        theme.name === 'dark' ? theme.primitives.violet[900] : theme.primitives.violet[100],
    },
    eventCardBrand: {
      borderColor:
        theme.name === 'dark' ? theme.primitives.mint[600] : theme.primitives.mint[300],
      backgroundColor:
        theme.name === 'dark' ? colors.background.subtle : theme.primitives.mint[100],
    },
    eventCardInfo: {
      borderColor:
        theme.name === 'dark' ? theme.primitives.sky[500] : theme.primitives.sky[300],
      backgroundColor:
        theme.name === 'dark' ? colors.status.infoBackground : theme.primitives.sky[100],
    },
    eventCardPressed: {
      opacity: 0.72,
    },
    eventIcon: {
      zIndex: 1,
      width: 62,
      height: 62,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
    },
    eventIconCompact: {
      width: 28,
      height: 28,
      borderRadius: spacing.x2,
    },
    eventIconAccent: {
      backgroundColor: colors.background.accent,
    },
    eventIconBrand: {
      backgroundColor: colors.background.brand,
    },
    eventIconInfo: {
      backgroundColor: colors.status.infoForeground,
    },
    eventCopy: {
      zIndex: 1,
      flex: 1,
      gap: 2,
    },
    eventTitleRow: {
      minHeight: 22,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x2,
    },
    eventTitle: {
      ...typography.titleMedium,
      flex: 1,
      color: colors.text.primary,
    },
    eventTitleCompact: {
      ...typography.bodySmall,
      fontFamily: theme.fontFamily.semiBold,
    },
    eventDate: {
      ...typography.bodySmall,
      color: colors.text.secondary,
    },
    eventDateCompact: {
      ...typography.caption,
    },
    eventGuests: {
      ...typography.caption,
      color: colors.text.muted,
    },
    eventChecklist: {
      ...typography.caption,
      marginTop: spacing.x2,
      fontFamily: theme.fontFamily.semiBold,
    },
    eventChecklistAccent: {
      color: colors.background.accent,
    },
    eventChecklistBrand: {
      color: colors.text.brand,
    },
    eventChecklistInfo: {
      color: colors.status.infoForeground,
    },
    eventProgressTrack: {
      height: 5,
      overflow: 'hidden',
      marginTop: spacing.x2,
      borderRadius: 3,
      backgroundColor: colors.border.default,
    },
    eventProgressValue: {
      height: '100%',
      borderRadius: 3,
    },
    eventProgressAccent: {
      backgroundColor: colors.background.accent,
    },
    eventProgressBrand: {
      backgroundColor: colors.background.brand,
    },
    eventProgressInfo: {
      backgroundColor: colors.status.infoForeground,
    },
    eventDecorations: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    eventDecorationCircle: {
      position: 'absolute',
      top: -42,
      right: -44,
      width: 112,
      height: 112,
      opacity: 0.32,
      borderRadius: 56,
    },
    eventDecorationCircleCompact: {
      top: -34,
      right: -36,
      width: 92,
      height: 92,
      borderRadius: 46,
    },
    eventDecorationPill: {
      position: 'absolute',
      right: spacing.x3,
      bottom: -2,
      width: 72,
      height: 22,
      opacity: 0.28,
      borderRadius: 11,
      transform: [{ rotate: '18deg' }],
    },
    eventDecorationPillCompact: {
      right: spacing.x2,
      bottom: -4,
      width: 64,
      height: 18,
      borderRadius: 9,
    },
    eventDecorationAccent: {
      backgroundColor: theme.primitives.violet[300],
    },
    eventDecorationBrand: {
      backgroundColor: theme.primitives.mint[300],
    },
    eventDecorationInfo: {
      backgroundColor: theme.primitives.sky[300],
    },
    viewToggle: {
      height: spacing.x10,
      flexDirection: 'row',
      marginTop: spacing.x5,
      padding: spacing.x1,
      borderRadius: spacing.x4,
      backgroundColor: colors.background.subtle,
    },
    viewToggleItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.x2,
      borderRadius: spacing.x3,
    },
    viewToggleItemActive: {
      backgroundColor: colors.background.brand,
    },
    viewToggleItemPressed: {
      opacity: 0.72,
    },
    viewToggleLabel: {
      ...typography.bodySmall,
      fontFamily: theme.fontFamily.semiBold,
      color: colors.text.secondary,
    },
    viewToggleLabelActive: {
      color: colors.text.onBrand,
    },
    monthSelector: {
      overflow: 'hidden',
      marginTop: 14,
      paddingVertical: spacing.x3,
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: spacing.x5,
      backgroundColor: colors.background.surface,
    },
    monthSelectorHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 14,
    },
    monthSelectorYear: {
      minHeight: spacing.x5,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x2,
    },
    monthSelectorYearLabel: {
      ...typography.labelLarge,
      color: colors.text.primary,
    },
    monthSelectorSummary: {
      ...typography.caption,
      color: colors.text.primary,
    },
    monthSelectorMonths: {
      gap: spacing.x1,
      paddingTop: spacing.x3,
      paddingHorizontal: spacing.x2,
    },
    monthSelectorItem: {
      width: 58,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
    },
    monthSelectorItemActive: {
      backgroundColor: colors.background.brand,
    },
    monthSelectorItemPressed: {
      opacity: 0.72,
    },
    monthSelectorItemLabel: {
      ...typography.bodySmall,
      fontFamily: theme.fontFamily.medium,
      color: colors.text.muted,
      textTransform: 'capitalize',
    },
    monthSelectorItemLabelActive: {
      fontFamily: theme.fontFamily.semiBold,
      color: colors.text.onBrand,
    },
    calendarSectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing.x6,
      marginBottom: spacing.x3,
      backgroundColor: colors.background.canvas,
    },
    calendarSectionTitle: {
      ...typography.titleMedium,
      color: colors.text.primary,
    },
    calendarSectionCount: {
      ...typography.caption,
      color: colors.text.muted,
    },
    timelineRow: {
      minHeight: 118,
      flexDirection: 'row',
      marginBottom: spacing.x3,
    },
    timelineTimeColumn: {
      position: 'relative',
      width: 72,
    },
    timelineTime: {
      ...typography.caption,
      color: colors.text.secondary,
    },
    timelineLine: {
      position: 'absolute',
      top: 28,
      right: 16,
      bottom: -spacing.x3,
      width: 1,
      backgroundColor: colors.border.default,
    },
    timelineDot: {
      position: 'absolute',
      top: 26,
      right: 13,
      width: 7,
      height: 7,
      borderWidth: 1,
      borderColor: colors.background.surface,
      borderRadius: 4,
      backgroundColor: colors.background.brand,
    },
    calendarEmpty: {
      ...typography.bodyMedium,
      marginTop: spacing.x8,
      color: colors.text.secondary,
      textAlign: 'center',
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
