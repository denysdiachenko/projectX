import { useGlobalSearchParams } from 'expo-router';

import EventGuestsContent from '@/components/EventGuestsScreen/EventGuestsContent';
import { getStringRouteParam } from '@/helpers/getStringRouteParam';

export default function EventGuestsScreen() {
  const { eventId: eventIdParam } = useGlobalSearchParams<{
    eventId?: string | string[];
  }>();
  const eventId = getStringRouteParam(eventIdParam);

  if (!eventId) return null;

  return <EventGuestsContent eventId={eventId} />;
}
