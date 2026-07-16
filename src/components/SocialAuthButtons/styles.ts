import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export default function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      gap: theme.spacing.x3,
    },
  });
}
