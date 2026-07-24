import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import AppChevron from '@/components/AppChevron/AppChevron';
import { getEventTypeIcon } from '@/constants/event-type-icons';
import { ROUTES } from '@/constants/routes';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import type { EventListItem } from '@/services/event-plan';

import { createMyEventsStyles } from './styles';

export default function MyEventCard({ event }: { event: EventListItem }) {
  const router = useRouter();
  const theme = useAppTheme();
  const { language, translations } = useAppLocalization();
  const styles = useMemo(() => createMyEventsStyles(theme), [theme]);
  const locale = language === 'uk' ? 'uk-UA' : 'en-US';
  const startsAt = new Date(event.starts_at);
  const date = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: event.time_zone,
  }).format(startsAt);
  const guests = event.adults_count + event.children_count;
  const completedTasks = event.checklist_items.filter((item) => item.is_completed).length;
  const totalTasks = event.checklist_items.length;
  const checklistProgress = totalTasks > 0 ? completedTasks / totalTasks : 0;
  const checklistLabel = totalTasks === 0
    ? translations.myEvents.checklistEmpty
    : completedTasks === totalTasks
      ? interpolate(translations.myEvents.checklistComplete, {
        completed: completedTasks,
        total: totalTasks,
      })
      : interpolate(translations.myEvents.checklistProgress, {
        completed: completedTasks,
        total: totalTasks,
      });
  const tone = getCardTone(event.event_type);
  const location = translations.eventPlan.locations[event.location] ?? event.location;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(ROUTES.eventPlan(event.id))}
      style={({ pressed }) => [
        styles.eventCard,
        styles[tone.cardStyle],
        pressed && styles.eventCardPressed,
      ]}>
      <View style={[styles.eventIcon, styles[tone.iconStyle]]}>
        <AntDesign
          name={getEventTypeIcon(event.event_type)}
          color={tone.iconColor(theme)}
          size={28}
        />
      </View>
      <View style={styles.eventCopy}>
        <View style={styles.eventTitleRow}>
          <Text numberOfLines={1} style={styles.eventTitle}>{event.name}</Text>
          <AppChevron color={theme.colors.text.muted} size={16} />
        </View>
        <Text style={styles.eventDate}>{`${date} · ${location}`}</Text>
        <Text style={styles.eventGuests}>
          {translations.myEvents.guests.replace('{count}', String(guests))}
        </Text>
        <Text style={[styles.eventChecklist, styles[tone.progressTextStyle]]}>
          {checklistLabel}
        </Text>
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
    </Pressable>
  );
}

type CardTone = {
  cardStyle: 'eventCardAccent' | 'eventCardBrand' | 'eventCardInfo';
  iconStyle: 'eventIconAccent' | 'eventIconBrand' | 'eventIconInfo';
  iconColor: (theme: ReturnType<typeof useAppTheme>) => string;
  progressStyle: 'eventProgressAccent' | 'eventProgressBrand' | 'eventProgressInfo';
  progressTextStyle:
    | 'eventChecklistAccent'
    | 'eventChecklistBrand'
    | 'eventChecklistInfo';
};

function getCardTone(eventType: string): CardTone {
  if (eventType === 'bbq') {
    return {
      cardStyle: 'eventCardBrand',
      iconStyle: 'eventIconBrand',
      iconColor: (theme) => theme.colors.text.onBrand,
      progressStyle: 'eventProgressBrand',
      progressTextStyle: 'eventChecklistBrand',
    };
  }

  if (eventType === 'home_party') {
    return {
      cardStyle: 'eventCardInfo',
      iconStyle: 'eventIconInfo',
      iconColor: (theme) => theme.colors.text.onSecondary,
      progressStyle: 'eventProgressInfo',
      progressTextStyle: 'eventChecklistInfo',
    };
  }

  return {
    cardStyle: 'eventCardAccent',
    iconStyle: 'eventIconAccent',
    iconColor: (theme) => theme.colors.text.onSecondary,
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
