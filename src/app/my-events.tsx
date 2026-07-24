import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import MyEventsContent from '@/components/MyEventsScreen/MyEventsContent';
import { createMyEventsStyles } from '@/components/MyEventsScreen/styles';
import { ROUTES } from '@/constants/routes';
import { useAppAuth } from '@/hooks/app-auth';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { useMyEvents } from '@/hooks/use-my-events';
import { getUserDisplayName } from '@/utils/user';

export default function MyEventsScreen() {
  const router = useRouter();
  const { user } = useAppAuth();
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const {
    events,
    hasError,
    isLoading,
    isRefreshing,
    refreshEvents,
    retryEvents,
  } = useMyEvents();
  const copy = translations.myEvents;
  const styles = useMemo(() => createMyEventsStyles(theme), [theme]);
  const displayName = getUserDisplayName(user, copy.defaultName);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style={theme.statusBar} />
      <MyEventsContent
        displayName={displayName}
        events={events}
        hasError={hasError}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        onRefresh={refreshEvents}
        onRetry={retryEvents}
      />
      {!isLoading && !hasError ? (
        <View style={styles.bottomAction}>
          <AppButton
            label={events.length > 0 ? copy.createAnother : copy.createEvent}
            onPress={() => router.push(ROUTES.createEvent)}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
}
