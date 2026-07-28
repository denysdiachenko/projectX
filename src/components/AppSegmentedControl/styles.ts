import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createAppSegmentedControlStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    container: {
      height: spacing.x10,
      flexDirection: 'row',
      marginTop: spacing.x5,
      padding: spacing.x1,
      borderRadius: spacing.x4,
      backgroundColor: colors.background.subtle,
    },
    item: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.x2,
      borderRadius: spacing.x3,
    },
    itemSelected: {
      backgroundColor: colors.background.brand,
    },
    itemPressed: {
      opacity: 0.72,
    },
    label: {
      ...typography.bodySmall,
      fontFamily: theme.fontFamily.semiBold,
      color: colors.text.secondary,
    },
    labelSelected: {
      color: colors.text.onBrand,
    },
  });
}
