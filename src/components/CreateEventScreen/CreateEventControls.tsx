import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo, type ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import { createCreateEventStyles } from './styles';

type AntDesignName = ComponentProps<typeof AntDesign>['name'];

export function SelectionCard({
  icon,
  label,
  hint,
  selected,
  onPress,
}: {
  icon: AntDesignName;
  label: string;
  hint: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createCreateEventStyles(theme), [theme]);

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.selectionCard,
        selected && styles.selectionCardSelected,
        pressed && styles.pressed,
      ]}>
      <View style={[styles.selectionIcon, selected && styles.selectionIconSelected]}>
        <AntDesign name={icon} color={theme.colors.text.onBrand} size={24} />
      </View>
      <View style={styles.selectionCopy}>
        <Text style={styles.selectionLabel}>{label}</Text>
        <Text style={styles.selectionHint}>{hint}</Text>
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

export function CounterRow({
  label,
  hint,
  value,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createCreateEventStyles(theme), [theme]);
  const canDecrease = value > 0;
  const canIncrease = max === undefined || value < max;

  return (
    <View style={styles.counterRow}>
      <View style={styles.counterCopy}>
        <Text style={styles.counterLabel}>{label}</Text>
        <Text style={styles.counterHint}>{hint}</Text>
      </View>
      <View style={styles.stepper}>
        <Pressable
          accessibilityLabel={`${label}: -1`}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canDecrease }}
          disabled={!canDecrease}
          onPress={() => onChange(value - 1)}
          style={({ pressed }) => [
            styles.stepperButton,
            !canDecrease && styles.stepperButtonDisabled,
            pressed && styles.pressed,
          ]}>
          <AntDesign
            name="minus"
            color={canDecrease ? theme.colors.text.onBrand : theme.colors.text.muted}
            size={16}
          />
        </Pressable>
        <Text style={styles.stepperValue}>{value}</Text>
        <Pressable
          accessibilityLabel={`${label}: +1`}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canIncrease }}
          disabled={!canIncrease}
          onPress={() => onChange(value + 1)}
          style={({ pressed }) => [
            styles.stepperButton,
            !canIncrease && styles.stepperButtonDisabled,
            pressed && styles.pressed,
          ]}>
          <AntDesign
            name="plus"
            color={canIncrease ? theme.colors.text.onBrand : theme.colors.text.muted}
            size={16}
          />
        </Pressable>
      </View>
    </View>
  );
}

export function ChoiceChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createCreateEventStyles(theme), [theme]);

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && styles.pressed,
      ]}>
      {selected ? (
        <AntDesign name="check" color={theme.colors.background.brand} size={14} />
      ) : null}
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

export function ReviewCard({
  icon,
  title,
  hint,
  changeLabel,
  onPress,
}: {
  icon: AntDesignName;
  title: string;
  hint: string;
  changeLabel: string;
  onPress: () => void;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createCreateEventStyles(theme), [theme]);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.reviewCard, pressed && styles.pressed]}>
      <View style={styles.reviewIcon}>
        <AntDesign name={icon} color={theme.colors.background.brand} size={20} />
      </View>
      <View style={styles.reviewCopy}>
        <Text numberOfLines={1} style={styles.reviewTitle}>{title}</Text>
        <Text numberOfLines={1} style={styles.reviewHint}>{hint}</Text>
      </View>
      <Text style={styles.change}>{changeLabel}</Text>
    </Pressable>
  );
}
