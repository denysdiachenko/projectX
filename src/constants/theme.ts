/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

import { colors, fontFamily, primitiveColors, spacing } from '@/theme';

// Compatibility shape for the remaining Expo starter components.
export const Colors = {
  light: {
    text: colors.text.primary,
    background: colors.background.canvas,
    backgroundElement: colors.background.surface,
    backgroundSelected: colors.background.subtle,
    textSecondary: colors.text.secondary,
  },
  dark: {
    text: primitiveColors.neutral[0],
    background: primitiveColors.neutral[950],
    backgroundElement: primitiveColors.neutral[900],
    backgroundSelected: primitiveColors.neutral[800],
    textSecondary: primitiveColors.neutral[400],
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: fontFamily.regular,
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: fontFamily.regular,
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: fontFamily.regular,
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: spacing.x1,
  two: spacing.x2,
  three: spacing.x4,
  four: spacing.x6,
  five: spacing.x8,
  six: spacing.x16,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
