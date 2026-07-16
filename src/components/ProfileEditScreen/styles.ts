import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createProfileEditStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      // backgroundColor: colors.background.canvas,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing.x6,
      paddingTop: spacing.x6,
      paddingBottom: spacing.x6,
    },
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarBlock: {
      alignItems: 'center',
    },
    changePhoto: {
      ...typography.labelLarge,
      marginTop: spacing.x2,
      color: colors.text.brand,
    },
    pressed: {
      opacity: 0.76,
    },
    form: {
      gap: spacing.x6,
      marginTop: spacing.x10,
    },
    saveButton: {
      marginTop: 'auto',
      paddingTop: spacing.x8,
    },
  });
}
