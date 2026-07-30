import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export function createAuthFlowScreenStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background.canvas,
    },
    fill: {
      flex: 1,
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
    topNavigation: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.x6,
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
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing.x6,
      paddingBottom: spacing.x6,
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
      maxWidth: 340,
      color: colors.text.secondary,
    },
    form: {
      gap: spacing.x4,
      marginTop: spacing.x8,
    },
    actions: {
      gap: spacing.x3,
      marginTop: spacing.x2,
    },
    note: {
      ...typography.caption,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    confirmation: {
      gap: spacing.x4,
      marginTop: spacing.x8,
      padding: spacing.x5,
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: spacing.x5,
      backgroundColor: colors.background.surface,
    },
    confirmationEmail: {
      ...typography.bodyMedium,
      color: colors.text.primary,
      textAlign: 'center',
    },
    state: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.x4,
      paddingHorizontal: spacing.x6,
      backgroundColor: colors.background.canvas,
    },
    stateIcon: {
      width: spacing.x16,
      height: spacing.x16,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: spacing.x8,
      backgroundColor: colors.background.accentSubtle,
    },
    stateTitle: {
      ...typography.titleLarge,
      color: colors.text.primary,
      textAlign: 'center',
    },
    stateMessage: {
      ...typography.bodyMedium,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    stateButton: {
      minWidth: 220,
    },
  });
}
