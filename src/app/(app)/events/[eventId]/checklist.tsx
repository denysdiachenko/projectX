import { useGlobalSearchParams } from 'expo-router';

import ChecklistContent from '@/components/ChecklistScreen/ChecklistContent';
import { getStringRouteParam } from '@/helpers/getStringRouteParam';

export default function EventChecklistScreen() {
  const params = useGlobalSearchParams<{ eventId?: string | string[] }>();
  const eventId = getStringRouteParam(params.eventId);

  return eventId ? <ChecklistContent eventId={eventId} /> : null;
}
