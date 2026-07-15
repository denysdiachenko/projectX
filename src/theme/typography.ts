import type { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

type TypographyStyle = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing'
>;

export const typography = {
  displayLarge: {
    fontFamily: fontFamily.bold,
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -1.2,
  },
  heading1: {
    fontFamily: fontFamily.bold,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -0.7,
  },
  heading2: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  heading3: {
    fontFamily: fontFamily.semiBold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  titleLarge: {
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
  },
  titleMedium: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontFamily: fontFamily.regular,
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  labelLarge: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelSmall: {
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  overline: {
    fontFamily: fontFamily.semiBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.1,
  },
} satisfies Record<string, TypographyStyle>;

export type TypographyToken = keyof typeof typography;
