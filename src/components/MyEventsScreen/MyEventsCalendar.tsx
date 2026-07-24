import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { SectionList, Text, View } from 'react-native';

import MyEventsMonthEvent from '@/components/MyEventsScreen/MyEventsMonthEvent';
import {
  formatEventCount,
  type EventDateSection,
} from '@/components/MyEventsScreen/month-helpers';
import { createMyEventsStyles } from '@/components/MyEventsScreen/styles';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

export default function MyEventsCalendar({
  header,
  onRefresh,
  refreshing,
  sections,
}: {
  header: ReactElement;
  onRefresh: () => void;
  refreshing: boolean;
  sections: EventDateSection[];
}) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const styles = useMemo(() => createMyEventsStyles(theme), [theme]);
  const copy = translations.myEvents;

  return (
    <SectionList
      key="calendar"
      style={styles.list}
      contentContainerStyle={styles.scrollContent}
      sections={sections}
      keyExtractor={(event) => event.id}
      ListEmptyComponent={<Text style={styles.calendarEmpty}>{copy.noEventsInMonth}</Text>}
      ListHeaderComponent={header}
      onRefresh={onRefresh}
      refreshing={refreshing}
      renderItem={({ item }) => <MyEventsMonthEvent event={item} />}
      renderSectionHeader={({ section }) => (
        <View style={styles.calendarSectionHeader}>
          <Text style={styles.calendarSectionTitle}>{section.title}</Text>
          <Text style={styles.calendarSectionCount}>
            {formatEventCount(copy, section.data.length)}
          </Text>
        </View>
      )}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
    />
  );
}
