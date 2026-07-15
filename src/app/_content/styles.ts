import type {AppTheme} from "@/hooks/app-theme";
import {StyleSheet} from "react-native";

export function createStyles(theme: AppTheme) {
  const {colors, spacing, typography} = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background.surface,
    },
    content: {
      flex: 1,
      gap: spacing.x6,
      backgroundColor: colors.background.canvas,
    },
    sheet: {
      height: 462,
      padding: spacing.x6,
      borderTopLeftRadius: spacing.x8,
      borderTopRightRadius: spacing.x8,
      backgroundColor: colors.background.surface,
      gap: spacing.x5,
    },
    eyebrow: {
      ...typography.overline,
      color: colors.text.brand,
    },
    title: {
      ...typography.heading2,
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.bodySmall,
      color: colors.text.secondary,
    },
    actions: {
      gap: spacing.x3,
    },
    loginRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.x1,
    },
    loginPrompt: {
      ...typography.caption,
      color: colors.text.secondary,
    },
    loginLink: {
      ...typography.labelSmall,
      color: colors.text.brand,
    },
    legal: {
      ...typography.overline,
      color: colors.text.muted,
      textAlign: 'center',
      letterSpacing: 0,
    },
  });
}
