import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createSwipeableItemRowStyles(theme: AppTheme) {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.background.surface,
    },
    childrenContainer: {
      backgroundColor: colors.background.surface,
    },
    deleteActionContainer: {
      width: 64,
      backgroundColor: colors.status.errorForeground,
    },
    deleteAction: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.status.errorForeground,
    },
    deleteActionPressed: {
      opacity: 0.8,
    },
    completeActionContainer: {
      width: 64,
      backgroundColor: colors.background.brand,
    },
    completeAction: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background.brand,
    },
    actionPressed: {
      opacity: 0.8,
    },
  });
}
