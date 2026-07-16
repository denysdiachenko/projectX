import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createProfileSettingSheetStyles(theme: AppTheme, bottomInset: number) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    root: {
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
    sheet: {
      paddingHorizontal: spacing.x6,
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
    title: {
      ...typography.titleLarge,
      marginTop: spacing.x5,
      color: colors.text.primary,
    },
    options: {
      overflow: 'hidden',
      marginTop: spacing.x4,
      marginBottom: spacing.x4,
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: spacing.x4,
      backgroundColor: colors.background.surface,
    },
    option: {
      minHeight: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.x4,
    },
    optionPressed: {
      backgroundColor: colors.background.subtle,
    },
    optionDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border.default,
    },
    optionLabel: {
      ...typography.bodyMedium,
      color: colors.text.primary,
    },
    optionLabelSelected: {
      color: colors.text.brand,
    },
    check: {
      width: spacing.x6,
      height: spacing.x6,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: spacing.x3,
      backgroundColor: colors.background.brand,
    },
  });
}
