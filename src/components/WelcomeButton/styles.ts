import type {AppTheme} from "@/hooks/app-theme";
import {StyleSheet} from "react-native";

export default function createStyles(theme: AppTheme) {
  const { colors, primitives, spacing, typography } = theme;

  return StyleSheet.create({
    button: {
      height: 52,
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.x4,
      gap: spacing.x2
    },
    primaryButton: {
      backgroundColor: colors.action.primary,
    },
    secondaryButton: {
      backgroundColor: colors.action.secondary,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    darkAppleButton: {
      backgroundColor: primitives.neutral[1000],
      borderColor: primitives.neutral[1000],
    },
    buttonPressed: {
      opacity: 0.76,
    },
    buttonLabel: {
      ...typography.labelLarge,
      color: colors.text.primary,
    },
    primaryButtonLabel: {
      color: colors.text.onBrand,
    },
  });
}
