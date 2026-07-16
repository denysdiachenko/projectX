import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

type ProfileRowStyleOptions = {
  danger: boolean;
  divider: boolean;
};

export default function createStyles(
  theme: AppTheme,
  { danger, divider }: ProfileRowStyleOptions,
) {
  return StyleSheet.create({
    row: {
      minHeight: 56,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.x4,
      gap: theme.spacing.x4,
      borderBottomWidth: divider ? StyleSheet.hairlineWidth : 0,
      borderBottomColor: theme.colors.border.default,
    },
    content: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.x3,
    },
    label: {
      ...theme.typography.bodyMedium,
      flexShrink: 1,
      color: danger ? theme.colors.status.errorForeground : theme.colors.text.primary,
    },
    value: {
      ...theme.typography.bodySmall,
      color: theme.colors.text.secondary,
    },
    pressed: {
      backgroundColor: theme.colors.background.subtle,
    },
  });
}
