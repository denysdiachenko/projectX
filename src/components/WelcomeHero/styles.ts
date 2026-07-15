import type {AppTheme} from "@/hooks/app-theme";
import {StyleSheet} from "react-native";
import {colorWithOpacity} from "@/helpers/colorWithOpacity";

export default function createStyles(theme: AppTheme) {
  const { colors, primitives, spacing } = theme;

  return StyleSheet.create({
    hero: {
      flex: 1,
      minHeight: 260,
      overflow: 'hidden',
      backgroundColor: colors.background.canvas
    },
    heroArt: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    decorOrb: {
      position: 'absolute',
      borderRadius: 999,
    },
    violetOrb: {
      width: 164,
      height: 164,
      top: -42,
      right: -44,
      backgroundColor: colorWithOpacity(colors.background.accent, 0.22),
    },
    coralOrb: {
      width: 116,
      height: 116,
      left: -46,
      bottom: spacing.x2,
      backgroundColor: primitives.coral[100],
    },
    decorBar: {
      position: 'absolute',
      borderRadius: 999,
    },
    yellowBar: {
      width: 128,
      height: 54,
      left: -32,
      top: 92,
      backgroundColor: primitives.yellow[100],
      transform: [{ rotate: '16deg' }],
    },
    mintBar: {
      width: 166,
      height: 70,
      right: -38,
      bottom: spacing.x5,
      backgroundColor: primitives.mint[200],
      transform: [{ rotate: '-18deg' }],
    },
    ringOuter: {
      position: 'absolute',
      width: 236,
      height: 236,
      borderRadius: 118,
      borderWidth: 1.5,
      borderColor: primitives.violet[200],
    },
    ringInner: {
      position: 'absolute',
      width: 184,
      height: 184,
      borderRadius: 92,
      borderWidth: 1,
      borderColor: primitives.mint[200],
    },
    iconHalo: {
      width: 156,
      height: 156,
      borderRadius: 78,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colorWithOpacity(colors.background.surface, 0.68),
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 18,
      elevation: 5,
    },
    heroIcon: {
      width: 114,
      height: 114,
      borderRadius: 28,
    },
    confetti: {
      position: 'absolute',
      width: spacing.x2,
      height: spacing.x6,
      borderRadius: spacing.x1,
    },
    confettiOne: {
      left: spacing.x20,
      top: 114,
      backgroundColor: primitives.coral[500],
      transform: [{ rotate: '-24deg' }],
    },
    confettiTwo: {
      right: 76,
      top: 102,
      backgroundColor: primitives.yellow[600],
      transform: [{ rotate: '22deg' }],
    },
    confettiThree: {
      right: 62,
      bottom: 50,
      backgroundColor: colors.background.accent,
      transform: [{ rotate: '-34deg' }],
    },
  });
}
