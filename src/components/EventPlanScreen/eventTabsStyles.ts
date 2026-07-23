import { StyleSheet } from 'react-native';

import { EVENT_TAB_BAR_HEIGHT } from '@/constants/event-tabs';
import type { AppTheme } from '@/hooks/app-theme';

const TAB_BUTTON_SIZE = 60;
const TAB_BUTTON_RADIUS = 30;

export function createEventTabsStyles(
  theme: AppTheme,
  bottomInset: number,
  viewportWidth: number,
) {
  const { colors, spacing } = theme;
  const itemHorizontalMargin = spacing.x1;
  const buttonsWidth = TAB_BUTTON_SIZE * 3 + itemHorizontalMargin * 6;
  const tabBarHorizontalPadding = Math.max(
    spacing.x5,
    (viewportWidth - buttonsWidth) / 2,
  );

  return StyleSheet.create({
    tabBar: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      left: 0,
      height: EVENT_TAB_BAR_HEIGHT + bottomInset,
      paddingHorizontal: tabBarHorizontalPadding,
      paddingTop: spacing.x2,
      paddingBottom: bottomInset + spacing.x2,
      backgroundColor: 'transparent',
      borderTopWidth: 0,
      elevation: 0,
      shadowOpacity: 0,
    },
    tabBarItem: {
      height: TAB_BUTTON_SIZE,
      marginHorizontal: itemHorizontalMargin,
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: TAB_BUTTON_RADIUS,
      backgroundColor: colors.background.surface,
      boxShadow: theme.name === 'dark'
        ? '0px 8px 20px 0px rgba(0, 0, 0, 0.32)'
        : '0px 8px 20px 0px rgba(33, 40, 59, 0.12)',
    },
    tabBarIcon: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
