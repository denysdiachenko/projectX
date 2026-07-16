import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export default function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    button: {
      width: theme.spacing.x10,
      height: theme.spacing.x10,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.x2,
      overflow: 'hidden',
      borderRadius: theme.spacing.x5,
      backgroundColor: theme.colors.background.accent,
    },
    pressed: {
      opacity: 0.76,
    },
    initial: {
      ...theme.typography.labelLarge,
      color: theme.primitives.neutral[0],
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
  });
}
