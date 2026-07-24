import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { createMyEventsStyles } from '@/components/MyEventsScreen/styles';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

export type MyEventsViewMode = 'calendar' | 'list';

export default function MyEventsViewToggle({
  onChange,
  value,
}: {
  onChange: (value: MyEventsViewMode) => void;
  value: MyEventsViewMode;
}) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const styles = useMemo(() => createMyEventsStyles(theme), [theme]);
  const copy = translations.myEvents;

  return (
    <View style={styles.viewToggle}>
      <ToggleItem
        active={value === 'list'}
        icon="unordered-list"
        label={copy.listView}
        onPress={() => onChange('list')}
      />
      <ToggleItem
        active={value === 'calendar'}
        icon="calendar"
        label={copy.calendarView}
        onPress={() => onChange('calendar')}
      />
    </View>
  );
}

function ToggleItem({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: 'calendar' | 'unordered-list';
  label: string;
  onPress: () => void;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createMyEventsStyles(theme), [theme]);
  const color = active ? theme.colors.text.onBrand : theme.colors.text.secondary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.viewToggleItem,
        active && styles.viewToggleItemActive,
        pressed && styles.viewToggleItemPressed,
      ]}>
      <AntDesign color={color} name={icon} size={16} />
      <Text style={[styles.viewToggleLabel, active && styles.viewToggleLabelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}
