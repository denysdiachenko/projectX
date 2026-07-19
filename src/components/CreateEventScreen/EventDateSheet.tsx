import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import { createCreateEventSheetStyles } from './sheetStyles';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate();
}

function getCalendarDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const mondayOffset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

type EventDateSheetProps = {
  value: Date;
  visible: boolean;
  onClose: () => void;
  onChange: (value: Date) => void;
};

export default function EventDateSheet({ value, visible, onClose, onChange }: EventDateSheetProps) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { language, translations } = useAppLocalization();
  const [selected, setSelected] = useState(value);
  const [month, setMonth] = useState(new Date(value.getFullYear(), value.getMonth(), 1));
  const [backdropOpacity] = useState(() => new Animated.Value(0));
  const [sheetTranslateY] = useState(() => new Animated.Value(48));
  const styles = useMemo(
    () => createCreateEventSheetStyles(theme, insets.bottom),
    [insets.bottom, theme],
  );
  const days = useMemo(() => getCalendarDays(month), [month]);
  const today = startOfDay(new Date());
  const locale = language === 'uk' ? 'uk-UA' : 'en-US';

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
  }, [backdropOpacity, sheetTranslateY, value, visible]);

  const closeSheet = () => {
    setSelected(value);
    setMonth(new Date(value.getFullYear(), value.getMonth(), 1));
    onClose();
  };

  return (
    <Modal animationType="none" onRequestClose={closeSheet} statusBarTranslucent transparent visible={visible}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable onPress={closeSheet} style={styles.backdropPressable} />
        </Animated.View>
        <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}>
          <View style={styles.handle} />
          <View style={styles.dateHeader}>
            <Text style={styles.dateTitle}>{translations.createEvent.datePicker.title}</Text>
          </View>
          <View style={styles.dateHeader}>
            <Pressable
              onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
              style={styles.monthAction}>
              <AntDesign name="left" color={theme.colors.text.primary} size={20} />
            </Pressable>
            <Text style={styles.monthTitle}>
              {new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(month)}
            </Text>
            <Pressable
              onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
              style={styles.monthAction}>
              <AntDesign name="right" color={theme.colors.text.primary} size={20} />
            </Pressable>
          </View>
          <View style={styles.weekdays}>
            {(language === 'uk' ? WEEKDAYS : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).map((day) => (
              <Text key={day} style={styles.weekday}>{day}</Text>
            ))}
          </View>
          <View style={styles.calendar}>
            {days.map((day) => {
              const inMonth = day.getMonth() === month.getMonth();
              const disabled = day < today;
              const isSelected = sameDay(day, selected);
              return (
                <Pressable
                  disabled={disabled}
                  key={day.toISOString()}
                  onPress={() => setSelected(day)}
                  style={styles.day}>
                  <View style={[styles.dayCircle, isSelected && styles.daySelected]}>
                    <Text
                      style={[
                        styles.dayText,
                        (!inMonth || disabled) && styles.dayTextMuted,
                        isSelected && styles.dayTextSelected,
                      ]}>
                      {day.getDate()}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <AppButton
            label={translations.createEvent.datePicker.confirm}
            onPress={() => {
              onChange(selected);
              onClose();
            }}
            style={styles.dateConfirm}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}
