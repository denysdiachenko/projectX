import { AntDesign } from '@react-native-vector-icons/ant-design';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import { createAppSegmentedControlStyles } from './styles';

type AntDesignIconName = ComponentProps<typeof AntDesign>['name'];

export type AppSegmentedControlOption<Value extends string> = {
  icon: AntDesignIconName;
  label: string;
  value: Value;
};

type AppSegmentedControlProps<Value extends string> = {
  onChange: (value: Value) => void;
  options: readonly AppSegmentedControlOption<Value>[];
  value: Value;
};

export default function AppSegmentedControl<Value extends string>({
  onChange,
  options,
  value,
}: AppSegmentedControlProps<Value>) {
  const theme = useAppTheme();
  const styles = useMemo(() => createAppSegmentedControlStyles(theme), [theme]);

  return (
    <View accessibilityRole="radiogroup" style={styles.container}>
      {options.map((option) => {
        const selected = option.value === value;
        const color = selected ? theme.colors.text.onBrand : theme.colors.text.secondary;

        return (
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.item,
              selected && styles.itemSelected,
              pressed && styles.itemPressed,
            ]}>
            <AntDesign color={color} name={option.icon} size={16} />
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
