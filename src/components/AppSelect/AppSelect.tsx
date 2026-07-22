import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import createStyles from './styles';

export type AppSelectOption = {
  label: string;
  value: string;
};

type AppSelectProps = {
  label: string;
  options: AppSelectOption[];
  value: string;
  error?: string;
  onBlur?: () => void;
  onChange: (value: string) => void;
};

export default function AppSelect({
  label,
  options,
  value,
  error,
  onBlur,
  onChange,
}: AppSelectProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [expanded, setExpanded] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  const selectOption = (nextValue: string) => {
    onChange(nextValue);
    onBlur?.();
    setExpanded(false);
  };

  return (
    <View style={[styles.container, expanded && styles.containerExpanded]}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((current) => !current)}
        style={({ pressed }) => [
          styles.field,
          expanded && styles.focusedField,
          error && styles.errorField,
          pressed && styles.pressed,
        ]}>
        <Text numberOfLines={1} style={styles.value}>
          {selectedOption?.label ?? value}
        </Text>
        <AntDesign
          color={theme.colors.text.secondary}
          name={expanded ? 'up' : 'down'}
          size={16}
        />
      </Pressable>

      {expanded ? (
        <View style={styles.options}>
          {options.map((option, index) => {
            const selected = option.value === value;

            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                key={option.value}
                onPress={() => selectOption(option.value)}
                style={({ pressed }) => [
                  styles.option,
                  index > 0 && styles.optionBorder,
                  selected && styles.optionSelected,
                  pressed && styles.pressed,
                ]}>
                <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                  {option.label}
                </Text>
                {selected ? (
                  <AntDesign color={theme.colors.text.brand} name="check" size={16} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {error ? <Text style={styles.errorLabel}>{error}</Text> : null}
    </View>
  );
}
