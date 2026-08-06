import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createMyEventsStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background.surface,
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
    titleRow: {
      minHeight: spacing.x10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.x3,
    },
    title: {
      ...typography.heading2,
      flex: 1,
      color: colors.text.primary,
    },
    viewModeButton: {
      width: spacing.x10,
      height: spacing.x10,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: spacing.x5,
      backgroundColor: colors.background.accentSubtle,
    },
    viewModeButtonPressed: {
      opacity: 0.68,
      transform: [{ scale: 0.96 }],
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
      minHeight: 176,
      overflow: 'hidden',
      padding: spacing.x4,
      paddingLeft: spacing.x24,
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: spacing.x4,
      backgroundColor: colors.background.surface,
      boxShadow: theme.name === 'dark'
        ? '0px 8px 20px 0px rgba(0, 0, 0, 0.26)'
        : '0px 8px 20px 0px rgba(33, 40, 59, 0.08)',
    },
    eventCardCompact: {
      flex: 1,
      minHeight: 132,
      padding: spacing.x3,
      paddingLeft: spacing.x4,
      borderRadius: spacing.x4,
    },
    eventAccentBar: {
      position: 'absolute',
      zIndex: 2,
      top: 0,
      bottom: 0,
      left: 0,
      width: spacing.x1,
    },
    eventAccentBarAccent: {
      backgroundColor: colors.background.accent,
    },
    eventAccentBarBrand: {
      backgroundColor: colors.background.brand,
    },
    eventAccentBarInfo: {
      backgroundColor: colors.status.infoForeground,
    },
    eventCardPressed: {
      opacity: 0.72,
    },
    eventDateRail: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: spacing.x1,
      width: 72,
    },
    eventDateDay: {
      ...typography.titleLarge,
      position: 'absolute',
      top: spacing.x6,
      width: '100%',
      textAlign: 'center',
    },
    eventDateMonth: {
      ...typography.overline,
      position: 'absolute',
      top: 58,
      width: '100%',
      textAlign: 'center',
    },
    eventDateDivider: {
      position: 'absolute',
      top: 88,
      left: spacing.x4,
      width: 44,
      height: 1,
      opacity: 0.35,
    },
    eventDateTime: {
      ...typography.caption,
      position: 'absolute',
      top: 102,
      width: '100%',
      color: colors.text.secondary,
      textAlign: 'center',
    },
    eventHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x3,
    },
    eventIcon: {
      width: spacing.x10,
      height: spacing.x10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: spacing.x3,
    },
    eventIconCompact: {
      width: spacing.x8,
      height: spacing.x8,
      borderRadius: spacing.x3,
    },
    eventIconAccent: {
      backgroundColor: colors.background.accentSubtle,
    },
    eventIconBrand: {
      backgroundColor: colors.background.subtle,
    },
    eventIconInfo: {
      backgroundColor: colors.status.infoBackground,
    },
    eventHeaderCopy: {
      flex: 1,
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
    eventVenueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x2,
      marginTop: spacing.x3,
    },
    eventVenue: {
      ...typography.caption,
      flex: 1,
      color: colors.text.muted,
    },
    eventStatus: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x1,
      paddingHorizontal: spacing.x2,
      paddingVertical: spacing.x1,
      borderRadius: spacing.x3,
    },
    eventBadgesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: spacing.x2,
      marginTop: spacing.x3,
    },
    eventInvitationBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x1,
      paddingHorizontal: spacing.x2,
      paddingVertical: spacing.x1,
      borderRadius: spacing.x3,
      backgroundColor: colors.background.accentSubtle,
    },
    eventInvitationBadgeText: {
      ...typography.overline,
      color: colors.background.accent,
    },
    eventStatus_upcoming: {
      backgroundColor: colors.background.subtle,
    },
    eventStatus_ongoing: {
      backgroundColor: colors.status.successBackground,
    },
    eventStatus_needs_closure: {
      backgroundColor: colors.status.warningBackground,
    },
    eventStatus_completed: {
      backgroundColor: colors.background.subtle,
    },
    eventStatusDot: {
      width: spacing.x2,
      height: spacing.x2,
      borderRadius: spacing.x1,
    },
    eventStatusDot_upcoming: {
      backgroundColor: colors.text.muted,
    },
    eventStatusDot_ongoing: {
      backgroundColor: colors.text.brand,
    },
    eventStatusDot_needs_closure: {
      backgroundColor: colors.status.warningForeground,
    },
    eventStatusDot_completed: {
      backgroundColor: colors.text.secondary,
    },
    eventStatusLabel: {
      ...typography.overline,
    },
    eventStatusLabel_upcoming: {
      color: colors.text.secondary,
    },
    eventStatusLabel_ongoing: {
      color: colors.text.brand,
    },
    eventStatusLabel_needs_closure: {
      color: colors.status.warningForeground,
    },
    eventStatusLabel_completed: {
      color: colors.text.secondary,
    },
    eventShoppingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x1,
      marginTop: spacing.x3,
    },
    eventShoppingRowEmpty: {
      paddingHorizontal: spacing.x2,
      paddingVertical: spacing.x1,
      borderRadius: spacing.x2,
      backgroundColor: colors.status.warningBackground,
    },
    eventShopping: {
      ...typography.caption,
      flex: 1,
      fontFamily: theme.fontFamily.semiBold,
    },
    eventShoppingEmpty: {
      color: colors.status.warningForeground,
    },
    eventShoppingProgress: {
      color: colors.background.accent,
    },
    eventShoppingComplete: {
      color: colors.text.brand,
    },
    eventChecklistBlock: {
      marginTop: spacing.x3,
    },
    eventChecklistRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x2,
    },
    eventChecklist: {
      ...typography.labelSmall,
      flex: 1,
      letterSpacing: 0,
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
      marginTop: spacing.x3,
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
    timelineLineBefore: {
      position: 'absolute',
      top: -spacing.x3,
      right: 16,
      width: 1,
      height: 42,
      backgroundColor: colors.border.default,
    },
    timelineLineAfter: {
      position: 'absolute',
      top: 29,
      right: 16,
      bottom: -spacing.x3,
      width: 1,
      backgroundColor: colors.border.default,
    },
    timelineDot: {
      position: 'absolute',
      zIndex: 1,
      top: 24,
      right: 11.5,
      width: 10,
      height: 10,
      borderWidth: 2,
      borderColor: colors.background.surface,
      borderRadius: 5,
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
      paddingBottom: spacing.x4,
      backgroundColor: colors.background.surface,
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
