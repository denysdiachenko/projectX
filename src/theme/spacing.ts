/**
 * 4-point spacing scale mirrored from the Figma variables.
 * Layout values outside this scale should be treated as exceptions.
 */
export const spacing = {
  none: 0,
  x1: 4,
  x2: 8,
  x3: 12,
  x4: 16,
  x5: 20,
  x6: 24,
  x8: 32,
  x10: 40,
  x12: 48,
  x16: 64,
  x20: 80,
  x24: 96,
} as const;

export const layoutSpacing = {
  screenHorizontal: spacing.x6,
  sectionGap: spacing.x6,
  componentPadding: spacing.x4,
  controlGap: spacing.x3,
} as const;
