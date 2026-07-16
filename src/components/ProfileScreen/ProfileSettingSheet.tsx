import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import { createProfileSettingSheetStyles } from './profileSettingSheetStyles';

export type ProfileSettingOption<Value extends string> = {
  label: string;
  value: Value;
};

type ProfileSettingSheetProps<Value extends string> = {
  busy?: boolean;
  options: ProfileSettingOption<Value>[];
  selectedValue: Value;
  title: string;
  visible: boolean;
  onClose: () => void;
  onSelect: (value: Value) => void;
};

export default function ProfileSettingSheet<Value extends string>({
  busy = false,
  options,
  selectedValue,
  title,
  visible,
  onClose,
  onSelect,
}: ProfileSettingSheetProps<Value>) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const [backdropOpacity] = useState(() => new Animated.Value(0));
  const [sheetTranslateY] = useState(() => new Animated.Value(48));
  const styles = useMemo(
    () => createProfileSettingSheetStyles(theme, insets.bottom),
    [insets.bottom, theme],
  );

  useEffect(() => {
    if (!visible) {
      backdropOpacity.setValue(0);
      sheetTranslateY.setValue(48);
      return;
    }

    const animation = Animated.parallel([
      Animated.timing(backdropOpacity, {
        duration: 180,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        duration: 240,
        easing: Easing.out(Easing.cubic),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => animation.stop();
  }, [backdropOpacity, sheetTranslateY, visible]);

  return (
    <Modal
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable
            accessibilityLabel={translations.common.cancel}
            accessibilityRole="button"
            disabled={busy}
            onPress={onClose}
            style={styles.backdropPressable}
          />
        </Animated.View>
        <Animated.View
          accessibilityViewIsModal
          style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          <View style={styles.options}>
            {options.map((option, index) => {
              const selected = option.value === selectedValue;

              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected, disabled: busy }}
                  disabled={busy}
                  key={option.value}
                  onPress={() => onSelect(option.value)}
                  style={({ pressed }) => [
                    styles.option,
                    pressed && styles.optionPressed,
                    index < options.length - 1 && styles.optionDivider,
                  ]}>
                  <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                    {option.label}
                  </Text>
                  {selected ? (
                    <View style={styles.check}>
                      <AntDesign name="check" color={theme.colors.text.onBrand} size={14} />
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
          <AppButton
            disabled={busy}
            label={translations.common.cancel}
            variant="secondary"
            onPress={onClose}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}
