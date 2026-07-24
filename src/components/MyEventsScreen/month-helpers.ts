import type { EventListItem } from '@/services/event-plan';

export type EventMonth = {
  month: number;
  year: number;
};

export type EventDateSection = {
  data: EventListItem[];
  key: string;
  title: string;
};

type EventCountCopy = {
  eventsCountFew: string;
  eventsCountMany: string;
  eventsCountOne: string;
};

export function getInitialEventMonth(events: EventListItem[]): EventMonth {
  const now = Date.now();
  const source = events.find((event) => new Date(event.starts_at).getTime() >= now)
    ?? events.at(-1);

  if (!source) {
    const date = new Date();
    return { month: date.getMonth(), year: date.getFullYear() };
  }

  return getEventDateParts(source);
}

export function getEventMonthCount(
  events: EventListItem[],
  selection: EventMonth,
) {
  return events.filter((event) => isEventInMonth(event, selection)).length;
}

export function getEventYears(events: EventListItem[]) {
  return [...new Set(events.map((event) => getEventDateParts(event).year))]
    .sort((left, right) => left - right);
}

export function createEventDateSections(
  events: EventListItem[],
  selection: EventMonth,
  locale: string,
): EventDateSection[] {
  const groups = new Map<string, EventListItem[]>();

  events
    .filter((event) => isEventInMonth(event, selection))
    .forEach((event) => {
      const parts = getEventDateParts(event);
      const key = `${parts.year}-${String(parts.month + 1).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
      groups.set(key, [...(groups.get(key) ?? []), event]);
    });

  return [...groups.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, data]) => ({
      data: data.sort(
        (left, right) =>
          new Date(left.starts_at).getTime() - new Date(right.starts_at).getTime(),
      ),
      key,
      title: capitalize(formatEventDay(data[0], locale)),
    }));
}

export function formatEventTime(event: EventListItem, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: event.time_zone,
  }).format(new Date(event.starts_at));
}

export function formatEventCount(copy: EventCountCopy, count: number) {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;
  const template =
    lastDigit === 1 && lastTwoDigits !== 11
      ? copy.eventsCountOne
      : lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)
        ? copy.eventsCountFew
        : copy.eventsCountMany;

  return template.replace('{count}', String(count));
}

function isEventInMonth(event: EventListItem, selection: EventMonth) {
  const parts = getEventDateParts(event);
  return parts.year === selection.year && parts.month === selection.month;
}

function getEventDateParts(event: EventListItem) {
  const parts = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'numeric',
    timeZone: event.time_zone,
    year: 'numeric',
  }).formatToParts(new Date(event.starts_at));
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    day: value('day'),
    month: value('month') - 1,
    year: value('year'),
  };
}

function formatEventDay(event: EventListItem, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    timeZone: event.time_zone,
    weekday: 'long',
  }).format(new Date(event.starts_at));
}

function capitalize(value: string) {
  return value.charAt(0).toLocaleUpperCase() + value.slice(1);
}
