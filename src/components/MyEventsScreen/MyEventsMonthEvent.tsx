import { useMemo } from 'react';
import { Text, View } from 'react-native';

import MyEventCard from '@/components/MyEventsScreen/MyEventCard';
import { formatEventTime } from '@/components/MyEventsScreen/month-helpers';
import { createMyEventsStyles } from '@/components/MyEventsScreen/styles';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import type { EventListItem } from '@/services/event-plan';

export default function MyEventsMonthEvent({
  event,
  isFirst,
  isLast,
}: {
  event: EventListItem;
  isFirst: boolean;
  isLast: boolean;
}) {
  const theme = useAppTheme();
  const { language } = useAppLocalization();
  const styles = useMemo(() => createMyEventsStyles(theme), [theme]);
  const locale = language === 'uk' ? 'uk-UA' : 'en-US';

  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineTimeColumn}>
        <Text style={styles.timelineTime}>{formatEventTime(event, locale)}</Text>
        {!isFirst ? <View style={styles.timelineLineBefore} /> : null}
        {!isLast ? <View style={styles.timelineLineAfter} /> : null}
        <View style={styles.timelineDot} />
      </View>
      <MyEventCard compact event={event} />
    </View>
  );
}
