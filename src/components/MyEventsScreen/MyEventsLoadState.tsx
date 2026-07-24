import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';

import AppButton from '@/components/AppButton/AppButton';
import MyEventsEmptyState from '@/components/MyEventsScreen/MyEventsEmptyState';
import { createMyEventsStyles } from '@/components/MyEventsScreen/styles';
import { MyEventsSkeleton } from '@/components/Skeletons';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

export default function MyEventsLoadState({
  hasError,
  header,
  isLoading,
  onRefresh,
  onRetry,
  refreshing,
}: {
  hasError: boolean;
  header: ReactElement;
  isLoading: boolean;
  onRefresh: () => void;
  onRetry: () => void;
  refreshing: boolean;
}) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const styles = useMemo(() => createMyEventsStyles(theme), [theme]);
  const copy = translations.myEvents;

  const renderState = () => {
    if (isLoading) {
      return <MyEventsSkeleton />;
    }

    if (hasError) {
      return (
        <View style={styles.listState}>
          <Text style={styles.listError}>{copy.loadError}</Text>
          <AppButton label={copy.retry} onPress={onRetry} style={styles.retryButton} />
        </View>
      );
    }

    return <MyEventsEmptyState />;
  };

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.scrollContent}
      data={[]}
      ListEmptyComponent={renderState}
      ListHeaderComponent={header}
      onRefresh={onRefresh}
      refreshing={refreshing}
      renderItem={() => null}
      showsVerticalScrollIndicator={false}
    />
  );
}
