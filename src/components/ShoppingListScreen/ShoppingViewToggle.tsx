import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import { createShoppingListStyles } from './styles';

export type ShoppingViewMode = 'grouped' | 'list';

type ShoppingViewToggleProps = {
  value: ShoppingViewMode;
  onChange: (value: ShoppingViewMode) => void;
};

const OPTIONS: { icon: 'appstore' | 'unordered-list'; value: ShoppingViewMode }[] = [
  { icon: 'appstore', value: 'grouped' },
  { icon: 'unordered-list', value: 'list' },
];

export default function ShoppingViewToggle({ value, onChange }: ShoppingViewToggleProps) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const styles = useMemo(() => createShoppingListStyles(theme), [theme]);
  const copy = translations.shopping;

  return (
    <View accessibilityRole="radiogroup" style={styles.viewToggle}>
      {OPTIONS.map((option) => {
        const isSelected = value === option.value;
        const label = option.value === 'grouped' ? copy.groupedView : copy.listView;

        return (
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.viewToggleButton,
              isSelected && styles.viewToggleButtonSelected,
              pressed && styles.pressed,
            ]}>
            <AntDesign
              color={isSelected ? theme.colors.text.brand : theme.colors.text.secondary}
              name={option.icon}
              size={17}
            />
            <Text
              style={[
                styles.viewToggleLabel,
                isSelected && styles.viewToggleLabelSelected,
              ]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
