import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import MyEventCard from '@/components/MyEventsScreen/MyEventCard';
import MyEventsEmptyState from '@/components/MyEventsScreen/MyEventsEmptyState';
import { createMyEventsStyles } from '@/components/MyEventsScreen/styles';
import { ROUTES } from '@/constants/routes';
import { useAppAuth } from '@/hooks/app-auth';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { getUserEvents, type EventListItem } from '@/services/event-plan';
import { getUserDisplayName } from '@/utils/user';

export default function MyEventsScreen() {
  const router = useRouter();
  const { user } = useAppAuth();
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.myEvents;
  const styles = useMemo(() => createMyEventsStyles(theme), [theme]);
  const displayName = getUserDisplayName(user, copy.defaultName);
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const greeting = events.length > 0 ? copy.greetingWithEvents : copy.greeting;

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      setEvents(await getUserEvents());
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    void loadEvents();
  }, [loadEvents]));

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.listState}>
          <ActivityIndicator color={theme.colors.background.brand} size="large" />
        </View>
      );
    }

    if (hasError) {
      return (
        <View style={styles.listState}>
          <Text style={styles.listError}>{copy.loadError}</Text>
          <AppButton
            label={copy.retry}
            onPress={() => void loadEvents()}
            style={styles.retryButton}
          />
        </View>
      );
    }

    return <MyEventsEmptyState />;
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style={theme.statusBar} />
      <FlatList
        contentContainerStyle={styles.scrollContent}
        data={events}
        keyExtractor={(event) => event.id}
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.greeting}>{greeting.replace('{name}', displayName)}</Text>
          </>
        }
        ListFooterComponent={events.length > 0 ? (
          <AppButton
            label={copy.createAnother}
            onPress={() => router.push(ROUTES.createEvent)}
            style={styles.listCreateButton}
          />
        ) : null}
        renderItem={({ item }) => (
          <View style={styles.eventsList}>
            <MyEventCard event={item} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
