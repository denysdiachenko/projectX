import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { Pressable } from 'react-native';

import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import { createMyEventsStyles } from './styles';

export type MyEventsViewMode = 'calendar' | 'list';

export default function MyEventsViewToggle({
  onChange,
  value,
}: {
  onChange: (value: MyEventsViewMode) => void;
  value: MyEventsViewMode;
}) {
  const { translations } = useAppLocalization();
  const theme = useAppTheme();
  const styles = useMemo(() => createMyEventsStyles(theme), [theme]);
  const copy = translations.myEvents;
  const nextValue = value === 'list' ? 'calendar' : 'list';
  const accessibilityLabel = nextValue === 'calendar'
    ? copy.calendarView
    : copy.listView;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint={accessibilityLabel}
      onPress={() => onChange(nextValue)}
      style={({ pressed }) => [
        styles.viewModeButton,
        pressed && styles.viewModeButtonPressed,
      ]}>
      <AntDesign
        color={theme.colors.background.accent}
        name={nextValue === 'calendar' ? 'calendar' : 'unordered-list'}
        size={22}
      />
    </Pressable>
  );
}
