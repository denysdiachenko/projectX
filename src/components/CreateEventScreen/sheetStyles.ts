import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createCreateEventSheetStyles(theme: AppTheme, bottomInset: number) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    root: { flex: 1, justifyContent: 'flex-end' },
    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: 'rgba(20, 24, 33, 0.48)',
    },
    backdropPressable: { flex: 1 },
    sheet: {
      paddingTop: spacing.x3,
      paddingHorizontal: spacing.x6,
      paddingBottom: Math.max(bottomInset, spacing.x6),
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      backgroundColor: colors.background.surface,
    },
    handle: {
      width: spacing.x12,
      height: spacing.x1,
      alignSelf: 'center',
      borderRadius: spacing.x1,
      backgroundColor: colors.border.strong,
    },
    centeredTitle: {
      ...typography.titleLarge,
      marginTop: spacing.x8,
      color: colors.text.primary,
      textAlign: 'center',
    },
    centeredBody: {
      ...typography.bodyMedium,
      marginTop: spacing.x3,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    actions: { gap: spacing.x3, marginTop: spacing.x8 },
    dateHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing.x5,
    },
    dateTitle: { ...typography.titleLarge, color: colors.text.primary },
    monthAction: {
      width: spacing.x10,
      height: spacing.x10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: spacing.x3,
    },
    monthTitle: {
      ...typography.labelLarge,
      color: colors.text.primary,
      textTransform: 'capitalize',
    },
    weekdays: { flexDirection: 'row', marginTop: spacing.x4 },
    weekday: {
      ...typography.caption,
      width: `${100 / 7}%`,
      color: colors.text.muted,
      textAlign: 'center',
    },
    calendar: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.x2 },
    day: {
      width: `${100 / 7}%`,
      height: spacing.x10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayCircle: {
      width: spacing.x8,
      height: spacing.x8,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: spacing.x4,
    },
    daySelected: { backgroundColor: colors.background.brand },
    dayText: { ...typography.bodySmall, color: colors.text.primary },
    dayTextMuted: { color: colors.text.muted },
    dayTextSelected: { color: colors.text.onBrand },
    dateConfirm: { marginTop: spacing.x5 },
  });
}
