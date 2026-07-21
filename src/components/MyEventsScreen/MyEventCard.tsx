import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

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
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: event.time_zone,
  }).format(startsAt);
  const guests = event.adults_count + event.children_count;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(ROUTES.eventPlan(event.id))}
      style={({ pressed }) => [styles.eventCard, pressed && styles.eventCardPressed]}>
      <View style={styles.eventIcon}>
        <AntDesign
          name={getEventTypeIcon(event.event_type)}
          color={theme.colors.background.brand}
          size={22}
        />
      </View>
      <View style={styles.eventCopy}>
        <Text numberOfLines={1} style={styles.eventTitle}>{event.name}</Text>
        <Text style={styles.eventDate}>{date}</Text>
        <Text style={styles.eventGuests}>
          {translations.myEvents.guests.replace('{count}', String(guests))}
        </Text>
      </View>
      <AntDesign name="right" color={theme.colors.text.muted} size={18} />
    </Pressable>
  );
}
