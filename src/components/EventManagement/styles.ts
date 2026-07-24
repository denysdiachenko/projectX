import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createEventManagementStyles(theme: AppTheme, bottomInset: number) {
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
    title: {
      ...typography.titleLarge,
      marginTop: spacing.x5,
      marginBottom: spacing.x3,
      color: colors.text.primary,
    },
    versionInfo: {
      minHeight: 64,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x3,
      marginBottom: spacing.x3,
      paddingHorizontal: spacing.x4,
      borderRadius: spacing.x4,
      backgroundColor: colors.background.subtle,
    },
    versionIcon: {
      width: spacing.x8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    versionCopy: {
      flex: 1,
      justifyContent: 'center',
      gap: spacing.x1,
    },
    versionLabel: {
      ...typography.caption,
      color: colors.text.secondary,
    },
    versionValue: {
      ...typography.labelLarge,
      color: colors.text.primary,
    },
    versionLoader: {
      alignSelf: 'flex-start',
    },
    action: {
      minHeight: 56,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.x3,
    },
    actionPressed: { opacity: 0.68 },
    actionDisabled: { opacity: 0.52 },
    actionLabel: { ...typography.bodyMedium, color: colors.text.primary },
    destructiveLabel: { color: colors.status.errorForeground },
    divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border.default },
    cancel: { alignItems: 'center', paddingVertical: spacing.x3 },
    cancelLabel: { ...typography.labelLarge, color: colors.text.secondary },
    centeredTitle: {
      ...typography.titleLarge,
      marginTop: spacing.x8,
      color: colors.text.primary,
      textAlign: 'center',
    },
    body: {
      ...typography.bodyMedium,
      marginTop: spacing.x3,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    actions: { gap: spacing.x3, marginTop: spacing.x8 },
    headerButton: {
      width: spacing.x10,
      height: spacing.x10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: spacing.x5,
    },
  });
}
