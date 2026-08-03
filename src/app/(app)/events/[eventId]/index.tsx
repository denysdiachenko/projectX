import { useLocalSearchParams } from 'expo-router';

import EventPlanContent from '@/components/EventPlanScreen/EventPlanContent';

export default function EventPlanScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  return <EventPlanContent eventId={eventId} />;
}
