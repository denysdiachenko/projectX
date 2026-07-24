import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, SectionList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import MyEventCard from '@/components/MyEventsScreen/MyEventCard';
import MyEventsEmptyState from '@/components/MyEventsScreen/MyEventsEmptyState';
import MyEventsMonthEvent from '@/components/MyEventsScreen/MyEventsMonthEvent';
import MyEventsMonthSelector from '@/components/MyEventsScreen/MyEventsMonthSelector';
import {
  createEventDateSections,
  formatEventCount,
  getEventMonthCount,
  getEventYears,
  getInitialEventMonth,
  type EventMonth,
} from '@/components/MyEventsScreen/month-helpers';
import { createMyEventsStyles } from '@/components/MyEventsScreen/styles';
import MyEventsViewToggle, {
  type MyEventsViewMode,
} from '@/components/MyEventsScreen/MyEventsViewToggle';
import { MyEventsSkeleton } from '@/components/Skeletons';
import { ROUTES } from '@/constants/routes';
import { useAppAuth } from '@/hooks/app-auth';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { getUserEvents, type EventListItem } from '@/services/event-plan';
import { getUserDisplayName } from '@/utils/user';

export default function MyEventsScreen() {
  const router = useRouter();
  const { user } = useAppAuth();
  const theme = useAppTheme();
  const { language, translations } = useAppLocalization();
  const copy = translations.myEvents;
  const styles = useMemo(() => createMyEventsStyles(theme), [theme]);
  const locale = language === 'uk' ? 'uk-UA' : 'en-US';
  const displayName = getUserDisplayName(user, copy.defaultName);
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [viewMode, setViewMode] = useState<MyEventsViewMode>('list');
  const [selectedMonth, setSelectedMonth] = useState<EventMonth | null>(null);
  const greeting = events.length > 0 ? copy.greetingWithEvents : copy.greeting;

  const loadEvents = useCallback(async (refreshing = false) => {
    if (refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setHasError(false);

    try {
      setEvents(await getUserEvents());
    } catch {
      setHasError(true);
    } finally {
      if (refreshing) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useFocusEffect(useCallback(() => {
    void loadEvents();
  }, [loadEvents]));

  const eventYears = useMemo(() => getEventYears(events), [events]);
  const initialMonth = useMemo(() => getInitialEventMonth(events), [events]);
  const activeMonth =
    selectedMonth && eventYears.includes(selectedMonth.year) ? selectedMonth : initialMonth;
  const monthEventCount = useMemo(
    () => getEventMonthCount(events, activeMonth),
    [activeMonth, events],
  );
  const monthSections = useMemo(
    () => createEventDateSections(events, activeMonth, locale),
    [activeMonth, events, locale],
  );
  const monthEventCountLabel = formatEventCount(copy, monthEventCount);

  const renderEmptyState = () => {
    if (isLoading) {
      return <MyEventsSkeleton />;
    }

    if (hasError) {
      return (
        <View style={styles.listState}>
          <Text style={styles.listError}>{copy.loadError}</Text>
          <AppButton
            label={copy.retry}
            onPress={() => void loadEvents()}
            style={styles.retryButton}
          />
        </View>
      );
    }

    return <MyEventsEmptyState />;
  };

  const renderHeader = (showControls: boolean) => (
    <>
      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.greeting}>{greeting.replace('{name}', displayName)}</Text>
      {showControls ? (
        <>
          <MyEventsViewToggle onChange={setViewMode} value={viewMode} />
          {viewMode === 'calendar' ? (
            <MyEventsMonthSelector
              eventCountLabel={monthEventCountLabel}
              eventYears={eventYears}
              onChange={setSelectedMonth}
              value={activeMonth}
            />
          ) : null}
        </>
      ) : null}
    </>
  );

  const renderEvents = () => {
    if (isLoading || hasError || events.length === 0) {
      return (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.scrollContent}
          data={[]}
          ListEmptyComponent={renderEmptyState}
          ListHeaderComponent={renderHeader(false)}
          onRefresh={() => void loadEvents(true)}
          refreshing={isRefreshing}
          renderItem={() => null}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    if (viewMode === 'calendar') {
      return (
        <SectionList
          key="calendar"
          style={styles.list}
          contentContainerStyle={styles.scrollContent}
          sections={monthSections}
          keyExtractor={(event) => event.id}
          ListEmptyComponent={<Text style={styles.calendarEmpty}>{copy.noEventsInMonth}</Text>}
          ListHeaderComponent={renderHeader(true)}
          onRefresh={() => void loadEvents(true)}
          refreshing={isRefreshing}
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

    return (
      <FlatList
        key="list"
        style={styles.list}
        contentContainerStyle={styles.scrollContent}
        data={events}
        keyExtractor={(event) => event.id}
        ListHeaderComponent={renderHeader(true)}
        onRefresh={() => void loadEvents(true)}
        refreshing={isRefreshing}
        renderItem={({ item }) => (
          <View style={styles.eventsList}>
            <MyEventCard event={item} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style={theme.statusBar} />
      {renderEvents()}
      {!isLoading && !hasError ? (
        <View style={styles.bottomAction}>
          <AppButton
            label={events.length > 0 ? copy.createAnother : copy.createEvent}
            onPress={() => router.push(ROUTES.createEvent)}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
}
