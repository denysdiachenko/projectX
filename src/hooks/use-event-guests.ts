import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  getEventGuestsScreenData,
  type EventGuest,
} from '@/services/invitations';

export function useEventGuests(eventId: string) {
  const [guests, setGuests] = useState<EventGuest[]>([]);
  const [eventName, setEventName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);

  const load = useCallback(async (refreshing = false) => {
    if (refreshing) setIsRefreshing(true);
    else setIsLoading(true);
    setHasError(false);

    try {
      const data = await getEventGuestsScreenData(eventId);
      setGuests(data.guests);
      setEventName(data.eventName);
    } catch {
      setHasError(true);
    } finally {
      if (refreshing) setIsRefreshing(false);
      else setIsLoading(false);
    }
  }, [eventId]);

  useFocusEffect(useCallback(() => {
    void load();
  }, [load]));

  return {
    eventName,
    guests,
    hasError,
    isLoading,
    isRefreshing,
    refresh: () => void load(true),
    retry: () => void load(),
  };
}
