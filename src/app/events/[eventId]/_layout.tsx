import { AntDesign } from '@react-native-vector-icons/ant-design';
import { Tabs, useGlobalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ShoppingTabIcon from '@/components/EventPlanScreen/ShoppingTabIcon';
import { createEventTabsStyles } from '@/components/EventPlanScreen/eventTabsStyles';
import { getStringRouteParam } from '@/helpers/getStringRouteParam';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { useShoppingListEmpty } from '@/hooks/use-shopping-list-empty';

const TAB_ICON_SIZE = 20;

export default function EventTabsLayout() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width: viewportWidth } = useWindowDimensions();
  const params = useGlobalSearchParams<{ eventId?: string | string[] }>();
  const eventId = getStringRouteParam(params.eventId);
  const isShoppingListEmpty = useShoppingListEmpty(eventId);
  const { translations } = useAppLocalization();
  const tabs = translations.eventPlan.tabs;
  const styles = useMemo(
    () => createEventTabsStyles(theme, insets.bottom, viewportWidth),
    [insets.bottom, theme, viewportWidth],
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.text.brand,
        tabBarInactiveTintColor: theme.colors.text.muted,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarItemStyle: styles.tabBarItem,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: tabs.plan,
          tabBarIcon: ({ color }) => (
            <AntDesign color={color} name="appstore" size={TAB_ICON_SIZE} />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          title: tabs.shopping,
          tabBarIcon: ({ color, focused }) => (
            <ShoppingTabIcon
              color={color}
              showEmptyAttention={isShoppingListEmpty && !focused}
              size={TAB_ICON_SIZE}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="checklist"
        options={{
          title: tabs.checklist,
          tabBarIcon: ({ color }) => (
            <AntDesign color={color} name="schedule" size={TAB_ICON_SIZE} />
          ),
        }}
      />
    </Tabs>
  );
}
