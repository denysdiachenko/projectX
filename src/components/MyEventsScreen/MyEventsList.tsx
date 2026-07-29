import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';

import MyEventCard from '@/components/MyEventsScreen/MyEventCard';
import { createMyEventsStyles } from '@/components/MyEventsScreen/styles';
import { useAppTheme } from '@/hooks/app-theme';
import type { EventListItem } from '@/services/event-plan';

export default function MyEventsList({
  events,
  emptyMessage,
  header,
  onRefresh,
  refreshing,
}: {
  events: EventListItem[];
  emptyMessage: string;
  header: ReactElement;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createMyEventsStyles(theme), [theme]);

  return (
    <FlatList
      key="list"
      style={styles.list}
      contentContainerStyle={styles.scrollContent}
      data={events}
      keyExtractor={(event) => event.id}
      ListEmptyComponent={<Text style={styles.calendarEmpty}>{emptyMessage}</Text>}
      ListHeaderComponent={header}
      onRefresh={onRefresh}
      refreshing={refreshing}
      renderItem={({ item }) => (
        <View style={styles.eventsList}>
          <MyEventCard event={item} />
        </View>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}
