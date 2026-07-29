import { useMemo, useState } from 'react';

import MyEventsCalendar from '@/components/MyEventsScreen/MyEventsCalendar';
import MyEventsHeader from '@/components/MyEventsScreen/MyEventsHeader';
import MyEventsList from '@/components/MyEventsScreen/MyEventsList';
import MyEventsLoadState from '@/components/MyEventsScreen/MyEventsLoadState';
import type { MyEventsPeriod } from '@/components/MyEventsScreen/MyEventsPeriodToggle';
import {
  createEventDateSections,
  formatEventCount,
  getEventMonthCount,
  getEventYears,
  getInitialEventMonth,
  type EventMonth,
} from '@/components/MyEventsScreen/month-helpers';
import type { MyEventsViewMode } from '@/components/MyEventsScreen/MyEventsViewToggle';
import { useAppLocalization } from '@/hooks/app-localization';
import { getEventLifecycleStatus } from '@/helpers/eventLifecycle';
import type { EventListItem } from '@/services/event-plan';

type MyEventsContentProps = {
  displayName: string;
  events: EventListItem[];
  hasError: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onRetry: () => void;
};

export default function MyEventsContent({
  displayName,
  events,
  hasError,
  isLoading,
  isRefreshing,
  onRefresh,
  onRetry,
}: MyEventsContentProps) {
  const { language, translations } = useAppLocalization();
  const locale = language === 'uk' ? 'uk-UA' : 'en-US';
  const [viewMode, setViewMode] = useState<MyEventsViewMode>('list');
  const [period, setPeriod] = useState<MyEventsPeriod>('upcoming');
  const [selectedMonth, setSelectedMonth] = useState<EventMonth | null>(null);
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
  const periodEvents = useMemo(
    () => events.filter((event) => {
      const status = getEventLifecycleStatus({
        completedAt: event.completed_at,
        durationHours: event.duration_hours,
        startsAt: event.starts_at,
        status: event.status,
      });
      const isPast = status === 'completed' || status === 'needs_closure';

      return period === 'past' ? isPast : !isPast;
    }),
    [events, period],
  );
  const header = (
    <MyEventsHeader
      activeMonth={activeMonth}
      displayName={displayName}
      eventCountLabel={formatEventCount(translations.myEvents, monthEventCount)}
      eventYears={eventYears}
      hasEvents={events.length > 0}
      onMonthChange={setSelectedMonth}
      onPeriodChange={setPeriod}
      onViewModeChange={setViewMode}
      showControls={!isLoading && !hasError && events.length > 0}
      period={period}
      viewMode={viewMode}
    />
  );

  if (isLoading || hasError || events.length === 0) {
    return (
      <MyEventsLoadState
        hasError={hasError}
        header={header}
        isLoading={isLoading}
        onRefresh={onRefresh}
        onRetry={onRetry}
        refreshing={isRefreshing}
      />
    );
  }

  if (viewMode === 'calendar') {
    return (
      <MyEventsCalendar
        header={header}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        sections={monthSections}
      />
    );
  }

  return (
    <MyEventsList
      emptyMessage={period === 'past' ? translations.myEvents.noPastEvents : translations.myEvents.noUpcomingEvents}
      events={periodEvents}
      header={header}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
    />
  );
}
