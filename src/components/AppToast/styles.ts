import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export default function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    wrapper: {
      width: '100%',
      paddingHorizontal: theme.spacing.x4,
    },
  });
}
