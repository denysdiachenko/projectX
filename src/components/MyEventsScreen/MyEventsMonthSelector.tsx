import { useEffect, useMemo, useRef } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import AppChevron from '@/components/AppChevron/AppChevron';
import { createMyEventsStyles } from '@/components/MyEventsScreen/styles';
import type { EventMonth } from '@/components/MyEventsScreen/month-helpers';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

const MONTH_ITEM_WIDTH = 62;

export default function MyEventsMonthSelector({
  eventCountLabel,
  eventYears,
  onChange,
  value,
}: {
  eventCountLabel: string;
  eventYears: number[];
  onChange: (value: EventMonth) => void;
  value: EventMonth;
}) {
  const theme = useAppTheme();
  const { language, translations } = useAppLocalization();
  const styles = useMemo(() => createMyEventsStyles(theme), [theme]);
  const scrollRef = useRef<ScrollView>(null);
  const locale = language === 'uk' ? 'uk-UA' : 'en-US';
  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, month) =>
        new Intl.DateTimeFormat(locale, { month: 'short' })
          .format(new Date(Date.UTC(2024, month, 1)))
          .replace('.', ''),
      ),
    [locale],
  );
  const yearIndex = eventYears.indexOf(value.year);
  const hasPreviousYear = yearIndex > 0;
  const hasNextYear = yearIndex >= 0 && yearIndex < eventYears.length - 1;

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollRef.current?.scrollTo({
        animated: false,
        x: Math.max(0, value.month * MONTH_ITEM_WIDTH - MONTH_ITEM_WIDTH * 2),
      });
    }, 0);

    return () => clearTimeout(timeout);
  }, [value.month, value.year]);

  const changeYear = (year: number) => {
    onChange({ month: value.month, year });
  };

  return (
    <View style={styles.monthSelector}>
      <View style={styles.monthSelectorHeader}>
        <View style={styles.monthSelectorYear}>
          {hasPreviousYear ? (
            <Pressable
              accessibilityLabel={translations.myEvents.previousYear}
              hitSlop={8}
              onPress={() => changeYear(eventYears[yearIndex - 1])}>
              <AppChevron color={theme.colors.text.secondary} direction="left" size={14} />
            </Pressable>
          ) : null}
          <Text style={styles.monthSelectorYearLabel}>{value.year}</Text>
          {hasNextYear ? (
            <Pressable
              accessibilityLabel={translations.myEvents.nextYear}
              hitSlop={8}
              onPress={() => changeYear(eventYears[yearIndex + 1])}>
              <AppChevron color={theme.colors.text.secondary} size={14} />
            </Pressable>
          ) : null}
        </View>
        <Text style={styles.monthSelectorSummary}>
          {translations.myEvents.eventsInMonth.replace('{count}', eventCountLabel)}
        </Text>
      </View>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.monthSelectorMonths}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {months.map((label, month) => {
          const selected = month === value.month;

          return (
            <Pressable
              key={label}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange({ month, year: value.year })}
              style={({ pressed }) => [
                styles.monthSelectorItem,
                selected && styles.monthSelectorItemActive,
                pressed && styles.monthSelectorItemPressed,
              ]}>
              <Text
                style={[
                  styles.monthSelectorItemLabel,
                  selected && styles.monthSelectorItemLabelActive,
                ]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
