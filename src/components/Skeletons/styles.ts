import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createSkeletonStyles(theme: AppTheme) {
  const { colors, spacing } = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background.canvas,
    },
    editEventScreen: {
      flex: 1,
      backgroundColor: colors.background.surface,
    },
    pulse: {
      width: '100%',
    },
    block: {
      overflow: 'hidden',
      borderRadius: spacing.x2,
      backgroundColor: colors.border.default,
    },
    content: {
      gap: spacing.x4,
      paddingHorizontal: spacing.x5,
      paddingTop: spacing.x4,
      paddingBottom: spacing.x24,
    },
    myEvents: {
      gap: spacing.x4,
      paddingTop: spacing.x6,
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
    eventIcon: {
      width: spacing.x12,
      height: spacing.x12,
      borderRadius: spacing.x3,
    },
    eventCopy: {
      flex: 1,
      gap: spacing.x2,
    },
    titleLine: {
      width: '62%',
      height: spacing.x4,
    },
    addLine: {
      width: 64,
      height: spacing.x4,
    },
    longLine: {
      width: '86%',
      height: spacing.x3,
    },
    mediumLine: {
      width: '56%',
      height: spacing.x3,
    },
    shortLine: {
      width: '32%',
      height: spacing.x3,
    },
    pageTitle: {
      width: '68%',
      height: spacing.x8,
      borderRadius: spacing.x3,
    },
    metaLine: {
      width: '54%',
      height: spacing.x4,
    },
    infoCard: {
      height: 62,
      marginTop: spacing.x1,
      borderRadius: spacing.x4,
    },
    sectionHeading: {
      width: '58%',
      height: spacing.x5,
      marginTop: spacing.x1,
    },
    planCard: {
      height: 184,
      borderRadius: 18,
    },
    planCardSmall: {
      height: 96,
      borderRadius: 18,
    },
    shoppingSummary: {
      height: 72,
      borderRadius: spacing.x4,
    },
    checklistSummary: {
      height: 88,
      borderRadius: spacing.x4,
    },
    checklistSectionTitle: {
      width: 112,
      height: spacing.x5,
      marginTop: spacing.x1,
    },
    checklistCard: {
      height: 280,
      borderRadius: spacing.x4,
    },
    checklistCardSmall: {
      height: 112,
      borderRadius: spacing.x4,
    },
    toggle: {
      height: spacing.x12,
      borderRadius: spacing.x3,
    },
    shoppingCard: {
      gap: spacing.x3,
      padding: spacing.x4,
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: spacing.x4,
      backgroundColor: colors.background.surface,
    },
    shoppingCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progressLine: {
      width: '100%',
      height: spacing.x1,
      borderRadius: 2,
    },
    profileContent: {
      alignItems: 'center',
      paddingHorizontal: spacing.x6,
      paddingTop: spacing.x3,
      paddingBottom: spacing.x6,
    },
    avatar: {
      width: spacing.x20,
      height: spacing.x20,
      borderRadius: spacing.x10,
    },
    avatarLarge: {
      width: spacing.x24,
      height: spacing.x24,
      alignSelf: 'center',
      borderRadius: spacing.x12,
    },
    profileName: {
      width: 152,
      height: spacing.x6,
      marginTop: spacing.x3,
    },
    profileEmail: {
      width: 196,
      height: spacing.x4,
      marginTop: spacing.x2,
    },
    button: {
      width: '100%',
      height: 52,
      marginTop: spacing.x4,
      borderRadius: 14,
    },
    profileSection: {
      width: '100%',
      gap: spacing.x3,
      marginTop: spacing.x5,
    },
    sectionLabel: {
      width: 92,
      height: spacing.x3,
    },
    profileGroup: {
      width: '100%',
      height: 104,
      borderRadius: spacing.x4,
    },
    editProfileContent: {
      flex: 1,
      paddingHorizontal: spacing.x6,
      paddingTop: spacing.x6,
      paddingBottom: spacing.x6,
    },
    changePhotoLine: {
      width: 132,
      height: spacing.x5,
      alignSelf: 'center',
      marginTop: spacing.x3,
    },
    formSkeleton: {
      gap: spacing.x3,
      marginTop: spacing.x10,
    },
    inputLabel: {
      width: 96,
      height: spacing.x4,
      marginTop: spacing.x2,
    },
    input: {
      width: '100%',
      height: 52,
      borderRadius: 14,
    },
    bottomButton: {
      width: '100%',
      height: 52,
      marginTop: 'auto',
      borderRadius: 14,
    },
    editEventContent: {
      gap: spacing.x4,
      paddingHorizontal: spacing.x6,
      paddingTop: spacing.x4,
    },
    progressSegments: {
      flexDirection: 'row',
      gap: 6,
      marginBottom: spacing.x4,
    },
    progressSegment: {
      flex: 1,
      height: spacing.x1,
      borderRadius: 2,
    },
    optionCard: {
      width: '100%',
      height: spacing.x20,
      borderRadius: spacing.x4,
    },
  });
}
