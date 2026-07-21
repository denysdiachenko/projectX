import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createShoppingTabIconStyles(theme: AppTheme, size: number) {
  return StyleSheet.create({
    container: {
      width: size + theme.spacing.x3,
      height: size + theme.spacing.x3,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pulse: {
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: theme.colors.status.errorForeground,
    },
  });
}
