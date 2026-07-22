import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/hooks/app-theme';

export default function createStyles(theme: AppTheme) {
  const { colors, fontFamily, spacing, typography } = theme;

  return StyleSheet.create({
    container: {
      position: 'relative',
      gap: spacing.x1,
    },
    containerExpanded: {
      zIndex: 10,
    },
    label: {
      ...typography.bodySmall,
      fontFamily: fontFamily.semiBold,
      color: colors.text.primary,
    },
    field: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.x2,
      paddingHorizontal: spacing.x4,
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: 14,
      backgroundColor: colors.background.surface,
    },
    focusedField: {
      borderColor: colors.border.brand,
    },
    errorField: {
      borderColor: colors.status.errorForeground,
    },
    pressed: {
      opacity: 0.64,
    },
    value: {
      ...typography.labelLarge,
      flex: 1,
      color: colors.text.primary,
      fontFamily: fontFamily.regular,
    },
    options: {
      position: 'absolute',
      top: 80,
      right: 0,
      left: 0,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: 14,
      backgroundColor: colors.background.surface,
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
    option: {
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.x4,
      backgroundColor: colors.background.surface,
    },
    optionBorder: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border.default,
    },
    optionSelected: {
      backgroundColor: colors.background.subtle,
    },
    optionLabel: {
      ...typography.bodyMedium,
      color: colors.text.primary,
    },
    optionLabelSelected: {
      color: colors.text.brand,
      fontFamily: fontFamily.semiBold,
    },
    errorLabel: {
      ...typography.caption,
      color: colors.status.errorForeground,
    },
  });
}
