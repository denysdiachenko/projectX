import { AntDesign } from '@react-native-vector-icons/ant-design';
import { Tabs, useGlobalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ShoppingTabIcon from '@/components/EventPlanScreen/ShoppingTabIcon';
import { getStringRouteParam } from '@/helpers/getStringRouteParam';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { useShoppingListEmpty } from '@/hooks/use-shopping-list-empty';

const TAB_ICON_SIZE = 30;

export default function EventTabsLayout() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const params = useGlobalSearchParams<{ eventId?: string | string[] }>();
  const eventId = getStringRouteParam(params.eventId);
  const isShoppingListEmpty = useShoppingListEmpty(eventId);
  const { translations } = useAppLocalization();
  const tabs = translations.eventPlan.tabs;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.text.brand,
        tabBarInactiveTintColor: theme.colors.text.muted,
        tabBarIconStyle: {
          transform: [{ translateY: theme.spacing.x4 }],
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background.surface,
          borderTopColor: theme.colors.border.default,
          paddingBottom: insets.bottom,
        },
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
