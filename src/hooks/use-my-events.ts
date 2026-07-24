import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getUserEvents, type EventListItem } from '@/services/event-plan';

export function useMyEvents() {
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);

  const loadEvents = useCallback(async (refreshing = false) => {
    if (refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setHasError(false);

    try {
      setEvents(await getUserEvents());
    } catch {
      setHasError(true);
    } finally {
      if (refreshing) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadEvents();
    }, [loadEvents]),
  );

  const refreshEvents = useCallback(() => {
    void loadEvents(true);
  }, [loadEvents]);

  const retryEvents = useCallback(() => {
    void loadEvents();
  }, [loadEvents]);

  return {
    events,
    hasError,
    isLoading,
    isRefreshing,
    refreshEvents,
    retryEvents,
  };
}
