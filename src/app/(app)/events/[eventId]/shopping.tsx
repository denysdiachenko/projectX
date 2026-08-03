import { useGlobalSearchParams } from 'expo-router';

import ShoppingListContent from '@/components/ShoppingListScreen/ShoppingListContent';
import { getStringRouteParam } from '@/helpers/getStringRouteParam';

export default function EventShoppingScreen() {
  const params = useGlobalSearchParams<{ eventId?: string | string[] }>();
  const eventId = getStringRouteParam(params.eventId);

  return eventId ? <ShoppingListContent eventId={eventId} /> : null;
}
