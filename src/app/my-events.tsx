import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MyEventsEmptyState from '@/components/MyEventsScreen/MyEventsEmptyState';
import { createMyEventsStyles } from '@/components/MyEventsScreen/styles';
import { useAppAuth } from '@/hooks/app-auth';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { getUserDisplayName } from '@/utils/user';

const EMPTY_EVENTS: never[] = [];

export default function MyEventsScreen() {
  const { user } = useAppAuth();
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.myEvents;
  const styles = useMemo(() => createMyEventsStyles(theme), [theme]);
  const displayName = getUserDisplayName(user, copy.defaultName);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style={theme.statusBar} />
      <FlatList
        contentContainerStyle={styles.scrollContent}
        data={EMPTY_EVENTS}
        ListEmptyComponent={MyEventsEmptyState}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.greeting}>{copy.greeting.replace('{name}', displayName)}</Text>
          </>
        }
        renderItem={() => null}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
