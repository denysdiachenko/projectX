import { AntDesign } from '@react-native-vector-icons/ant-design';
import { Tabs, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ShoppingTabIcon from '@/components/EventPlanScreen/ShoppingTabIcon';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { useShoppingListEmpty } from '@/hooks/use-shopping-list-empty';

const TAB_ICON_SIZE = 28;

export default function EventTabsLayout() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
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
          transform: [{ translateY: theme.spacing.x2 }],
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60 + insets.bottom,
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
            <AntDesign color={color} name="bars" size={TAB_ICON_SIZE} />
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
            <AntDesign color={color} name="check-square" size={TAB_ICON_SIZE} />
          ),
        }}
      />
    </Tabs>
  );
}
