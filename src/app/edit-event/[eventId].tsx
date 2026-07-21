import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import AppButton from '@/components/AppButton/AppButton';
import EventFormScreen from '@/components/CreateEventScreen/EventFormScreen';
import { createCreateEventStyles } from '@/components/CreateEventScreen/styles';
import type { CreateEventDraft } from '@/components/CreateEventScreen/types';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { getEventDraft } from '@/services/event-plan';

export default function EditEventScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const styles = useMemo(() => createCreateEventStyles(theme), [theme]);
  const [draft, setDraft] = useState<CreateEventDraft | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    let isActive = true;

    void getEventDraft(eventId)
      .then((eventDraft) => {
        if (isActive) setDraft(eventDraft);
      })
      .catch(() => {
        if (isActive) setHasError(true);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [eventId, requestKey]);

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.loadingState]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color={theme.colors.background.brand} size="large" />
      </View>
    );
  }

  if (hasError || !draft) {
    return (
      <View style={[styles.screen, styles.loadingState]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.loadError}>{translations.eventManagement.loadError}</Text>
        <AppButton
          label={translations.eventManagement.retry}
          onPress={() => {
            setHasError(false);
            setIsLoading(true);
            setRequestKey((current) => current + 1);
          }}
          style={styles.retryButton}
        />
      </View>
    );
  }

  return <EventFormScreen eventId={eventId} initialDraft={draft} mode="edit" />;
}
