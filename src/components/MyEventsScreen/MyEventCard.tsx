import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import AppChevron from '@/components/AppChevron/AppChevron';
import { getEventTypeIcon } from '@/constants/event-type-icons';
import { ROUTES } from '@/constants/routes';
import {
  getEventLifecycleStatus,
  type EventLifecycleStatus,
} from '@/helpers/eventLifecycle';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import type { EventListItem } from '@/services/event-plan';

import { createMyEventsStyles } from './styles';

export default function MyEventCard({
  compact = false,
  event,
}: {
  compact?: boolean;
  event: EventListItem;
}) {
  const router = useRouter();
  const theme = useAppTheme();
  const { language, translations } = useAppLocalization();
  const styles = useMemo(() => createMyEventsStyles(theme), [theme]);
  const locale = language === 'uk' ? 'uk-UA' : 'en-US';
  const startsAt = new Date(event.starts_at);
  const eventDay = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    timeZone: event.time_zone,
  }).format(startsAt);
  const eventMonth = new Intl.DateTimeFormat(locale, {
    month: 'short',
    timeZone: event.time_zone,
  }).format(startsAt).replace('.', '').toLocaleUpperCase(locale);
  const eventTime = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: event.time_zone,
  }).format(startsAt);
  const guests = event.adults_count + event.children_count;
  const completedTasks = event.checklist_items.filter((item) => item.is_completed).length;
  const totalTasks = event.checklist_items.length;
  const checklistProgress = totalTasks > 0 ? completedTasks / totalTasks : 0;
  const checklistLabel = completedTasks === totalTasks
    ? interpolate(translations.myEvents.checklistComplete, {
      completed: completedTasks,
      total: totalTasks,
    })
    : interpolate(translations.myEvents.checklistProgress, {
      completed: completedTasks,
      total: totalTasks,
    });
  const purchasedItems = event.shopping_items.filter((item) => item.is_purchased).length;
  const totalShoppingItems = event.shopping_items.length;
  const shoppingState = totalShoppingItems === 0
    ? 'empty'
    : purchasedItems === totalShoppingItems
      ? 'complete'
      : 'progress';
  const shoppingLabel = shoppingState === 'empty'
    ? translations.myEvents.shoppingEmpty
    : interpolate(
      shoppingState === 'complete'
        ? translations.myEvents.shoppingComplete
        : translations.myEvents.shoppingProgress,
      {
        purchased: purchasedItems,
        total: totalShoppingItems,
      },
    );
  const tone = getCardTone(event.event_type);
  const location = event.location_text
    || translations.eventPlan.locations[event.location]
    || event.location;
  const guestsLabel = translations.myEvents.guests.replace('{count}', String(guests));
  const eventMeta = compact ? `${location} · ${guestsLabel}` : guestsLabel;
  const lifecycleStatus = getEventLifecycleStatus({
    completedAt: event.completed_at,
    durationHours: event.duration_hours,
    startsAt: event.starts_at,
    status: event.status,
  });
  const lifecycleLabel = getLifecycleLabel(lifecycleStatus, translations.myEvents.statuses);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(ROUTES.eventPlan(event.id))}
      style={({ pressed }) => [
        styles.eventCard,
        compact && styles.eventCardCompact,
        pressed && styles.eventCardPressed,
      ]}>
      <View style={[styles.eventAccentBar, styles[tone.accentStyle]]} />
      {!compact ? (
        <View style={[styles.eventDateRail, styles[tone.iconStyle]]}>
          <Text style={[styles.eventDateDay, { color: tone.iconColor(theme) }]}>
            {eventDay}
          </Text>
          <Text style={[styles.eventDateMonth, { color: tone.iconColor(theme) }]}>
            {eventMonth}
          </Text>
          <View style={[styles.eventDateDivider, styles[tone.progressStyle]]} />
          <Text style={styles.eventDateTime}>{eventTime}</Text>
        </View>
      ) : null}
      <View style={styles.eventHeader}>
        {compact ? (
          <View style={[styles.eventIcon, styles.eventIconCompact, styles[tone.iconStyle]]}>
            <AntDesign
              name={getEventTypeIcon(event.event_type)}
              color={tone.iconColor(theme)}
              size={17}
            />
          </View>
        ) : null}
        <View style={styles.eventHeaderCopy}>
          <View style={styles.eventTitleRow}>
            <Text
              numberOfLines={compact ? 1 : 2}
              style={[styles.eventTitle, compact && styles.eventTitleCompact]}>
              {event.name}
            </Text>
            <AppChevron color={theme.colors.text.muted} size={16} />
          </View>
          <Text
            numberOfLines={1}
            style={[styles.eventDate, compact && styles.eventDateCompact]}>
            {eventMeta}
          </Text>
        </View>
      </View>
      {!compact ? (
        <View style={styles.eventVenueRow}>
          <AntDesign color={theme.colors.text.muted} name="environment" size={14} />
          <Text numberOfLines={1} style={styles.eventVenue}>
            {location}
          </Text>
        </View>
      ) : null}
      <View style={[styles.eventStatus, styles[`eventStatus_${lifecycleStatus}`]]}>
        <View style={[styles.eventStatusDot, styles[`eventStatusDot_${lifecycleStatus}`]]} />
        <Text style={[styles.eventStatusLabel, styles[`eventStatusLabel_${lifecycleStatus}`]]}>
          {lifecycleLabel}
        </Text>
      </View>
      <View
        style={[
          styles.eventShoppingRow,
          shoppingState === 'empty' && styles.eventShoppingRowEmpty,
        ]}>
        <AntDesign
          color={getShoppingStatusColor(shoppingState, theme)}
          name={shoppingState === 'empty' ? 'exclamation-circle' : 'shopping-cart'}
          size={14}
        />
        <Text
          numberOfLines={1}
          style={[
            styles.eventShopping,
            shoppingState === 'empty' && styles.eventShoppingEmpty,
            shoppingState === 'progress' && styles.eventShoppingProgress,
            shoppingState === 'complete' && styles.eventShoppingComplete,
          ]}>
          {shoppingLabel}
        </Text>
      </View>
      {totalTasks > 0 ? (
        <View style={styles.eventChecklistBlock}>
          <View style={styles.eventChecklistRow}>
            <AntDesign
              color={tone.progressColor(theme)}
              name="check-square"
              size={14}
            />
            <Text style={[styles.eventChecklist, styles[tone.progressTextStyle]]}>
              {checklistLabel}
            </Text>
          </View>
          <View style={styles.eventProgressTrack}>
            <View
              style={[
                styles.eventProgressValue,
                styles[tone.progressStyle],
                { width: `${checklistProgress * 100}%` },
              ]}
            />
          </View>
        </View>
      ) : null}
    </Pressable>
  );
}

function getLifecycleLabel(
  status: EventLifecycleStatus,
  labels: ReturnType<typeof useAppLocalization>['translations']['myEvents']['statuses'],
) {
  if (status === 'needs_closure') return labels.needsClosure;
  return labels[status];
}

type ShoppingState = 'complete' | 'empty' | 'progress';

function getShoppingStatusColor(
  state: ShoppingState,
  theme: ReturnType<typeof useAppTheme>,
) {
  if (state === 'empty') return theme.colors.status.warningForeground;
  if (state === 'complete') return theme.colors.text.brand;
  return theme.colors.background.accent;
}

type CardTone = {
  accentStyle: 'eventAccentBarAccent' | 'eventAccentBarBrand' | 'eventAccentBarInfo';
  iconStyle: 'eventIconAccent' | 'eventIconBrand' | 'eventIconInfo';
  iconColor: (theme: ReturnType<typeof useAppTheme>) => string;
  progressColor: (theme: ReturnType<typeof useAppTheme>) => string;
  progressStyle: 'eventProgressAccent' | 'eventProgressBrand' | 'eventProgressInfo';
  progressTextStyle:
    | 'eventChecklistAccent'
    | 'eventChecklistBrand'
    | 'eventChecklistInfo';
};

function getCardTone(eventType: string): CardTone {
  if (eventType === 'bbq') {
    return {
      accentStyle: 'eventAccentBarBrand',
      iconStyle: 'eventIconBrand',
      iconColor: (theme) => theme.colors.text.brand,
      progressColor: (theme) => theme.colors.text.brand,
      progressStyle: 'eventProgressBrand',
      progressTextStyle: 'eventChecklistBrand',
    };
  }

  if (eventType === 'home_party') {
    return {
      accentStyle: 'eventAccentBarInfo',
      iconStyle: 'eventIconInfo',
      iconColor: (theme) => theme.colors.status.infoForeground,
      progressColor: (theme) => theme.colors.status.infoForeground,
      progressStyle: 'eventProgressInfo',
      progressTextStyle: 'eventChecklistInfo',
    };
  }

  return {
    accentStyle: 'eventAccentBarAccent',
    iconStyle: 'eventIconAccent',
    iconColor: (theme) => theme.colors.background.accent,
    progressColor: (theme) => theme.colors.background.accent,
    progressStyle: 'eventProgressAccent',
    progressTextStyle: 'eventChecklistAccent',
  };
}

function interpolate(template: string, values: Record<string, number>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    template,
  );
}
