import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createLoginStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background.canvas,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing.x6,
      paddingBottom: spacing.x2,
    },
    violetOrb: {
      position: 'absolute',
      top: -42,
      right: -52,
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: colors.background.accent,
      opacity: 0.16,
    },
    mintDot: {
      position: 'absolute',
      top: 143,
      right: 53,
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.background.subtle,
    },
    mintBar: {
      position: 'absolute',
      top: 126,
      left: -34,
      width: 128,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.background.subtle,
      transform: [{ rotate: '15deg' }],
    },
    topNavigation: {
      height: 56,
      paddingHorizontal: spacing.x6,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    backButton: {
      width: spacing.x10,
      height: spacing.x10,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    backButtonPressed: {
      opacity: 0.72,
    },
    intro: {
      gap: spacing.x2,
    },
    title: {
      ...typography.heading2,
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.bodyMedium,
      maxWidth: 320,
      color: colors.text.secondary,
    },
  });
}
