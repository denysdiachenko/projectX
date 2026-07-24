import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import { ChecklistSkeleton } from '@/components/Skeletons';
import { EVENT_TAB_BAR_HEIGHT } from '@/constants/event-tabs';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import {
  createChecklistItem,
  deleteChecklistItem,
  getChecklist,
  setChecklistItemCompleted,
  type ChecklistItem,
  updateChecklistItem,
} from '@/services/checklist';
import { showToast } from '@/services/toast';

import ChecklistProgress from './ChecklistProgress';
import ChecklistSection from './ChecklistSection';
import ChecklistTaskSheet from './ChecklistTaskSheet';
import { createChecklistStyles } from './styles';

type EditorState = ChecklistItem | 'new' | null;

export default function ChecklistContent({ eventId }: { eventId: string }) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { translations } = useAppLocalization();
  const copy = translations.checklist;
  const styles = useMemo(
    () => createChecklistStyles(theme, 0, EVENT_TAB_BAR_HEIGHT + insets.bottom),
    [insets.bottom, theme],
  );
  const [items, setItems] = useState<ChecklistItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [editor, setEditor] = useState<EditorState>(null);

  const loadChecklist = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      setItems(await getChecklist(eventId));
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  const refreshChecklist = useCallback(async () => {
    setIsRefreshing(true);

    try {
      setItems(await getChecklist(eventId));
      setHasError(false);
    } catch {
      showToast({
        message: copy.loadError,
        title: copy.loadErrorTitle,
        type: 'error',
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [copy.loadError, copy.loadErrorTitle, eventId]);

  useFocusEffect(useCallback(() => {
    let active = true;

    void getChecklist(eventId)
      .then((nextItems) => {
        if (active) {
          setItems(nextItems);
          setHasError(false);
        }
      })
      .catch(() => {
        if (active) setHasError(true);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [eventId]));

  const getItemTitle = useCallback((item: ChecklistItem) => {
    if (item.source === 'custom') return item.custom_title ?? '';
    if (!item.item_key) return '';

    return copy.items[item.item_key] ?? item.item_key;
  }, [copy.items]);

  const saveItem = async (title: string) => {
    if (!items || !editor) return;

    try {
      const savedItem = editor === 'new'
        ? await createChecklistItem({
          eventId,
          sortOrder: getNextSortOrder(items),
          title,
        })
        : await updateChecklistItem(editor.id, title);

      setItems((current) => current
        ? editor === 'new'
          ? [...current, savedItem]
          : current.map((item) => item.id === savedItem.id ? savedItem : item)
        : current);
      setEditor(null);
    } catch {
      showToast({
        message: copy.saveErrorMessage,
        title: copy.saveErrorTitle,
        type: 'error',
      });
    }
  };

  const toggleItem = async (item: ChecklistItem) => {
    const nextCompleted = !item.is_completed;
    setItems((current) => current?.map((entry) => entry.id === item.id
      ? { ...entry, is_completed: nextCompleted }
      : entry) ?? current);

    try {
      const updated = await setChecklistItemCompleted(item.id, nextCompleted);
      setItems((current) => current?.map((entry) => entry.id === updated.id
        ? updated
        : entry) ?? current);
    } catch {
      setItems((current) => current?.map((entry) => entry.id === item.id ? item : entry) ?? current);
      showToast({
        message: copy.toggleErrorMessage,
        title: copy.toggleErrorTitle,
        type: 'error',
      });
    }
  };

  const requestDelete = (item: ChecklistItem) => {
    Alert.alert(copy.deleteConfirmTitle, copy.deleteConfirmMessage, [
      { style: 'cancel', text: copy.form.cancel },
      {
        style: 'destructive',
        text: copy.deleteAction,
        onPress: () => {
          void deleteChecklistItem(item.id)
            .then(() => {
              setItems((current) => current?.filter((entry) => entry.id !== item.id) ?? current);
            })
            .catch(() => {
              showToast({
                message: copy.deleteErrorMessage,
                title: copy.deleteErrorTitle,
                type: 'error',
              });
            });
        },
      },
    ]);
  };

  const openItemActions = (item: ChecklistItem) => {
    const actions = item.source === 'custom'
      ? [{
        text: copy.editAction,
        onPress: () => setEditor(item),
      }]
      : [];

    Alert.alert(getItemTitle(item), undefined, [
      ...actions,
      {
        style: 'destructive',
        text: copy.deleteAction,
        onPress: () => {
          setTimeout(() => requestDelete(item), 200);
        },
      },
      { style: 'cancel', text: copy.form.cancel },
    ]);
  };

  if (isLoading) {
    return (
      <>
        <StatusBar barStyle={theme.statusBar === 'dark' ? 'dark-content' : 'light-content'} />
        <ChecklistSkeleton />
      </>
    );
  }

  if (hasError || !items) {
    return (
      <View style={[styles.screen, styles.state]}>
        <Text style={styles.stateText}>{copy.loadError}</Text>
        <AppButton
          label={copy.retry}
          onPress={() => void loadChecklist()}
          style={styles.retryButton}
        />
      </View>
    );
  }

  const remainingItems = items.filter((item) => !item.is_completed);
  const completedItems = items.filter((item) => item.is_completed);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle={theme.statusBar === 'dark' ? 'dark-content' : 'light-content'} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={(
          <RefreshControl
            colors={[theme.colors.background.accent]}
            refreshing={isRefreshing}
            tintColor={theme.colors.background.accent}
            onRefresh={() => void refreshChecklist()}
          />
        )}
        showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{copy.title}</Text>
          <Pressable
            accessibilityLabel={copy.addTask}
            accessibilityRole="button"
            onPress={() => setEditor('new')}
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
            <AntDesign color={theme.colors.text.brand} name="plus" size={20} />
            <Text style={styles.addButtonLabel}>{copy.add}</Text>
          </Pressable>
        </View>

        <ChecklistProgress completed={completedItems.length} total={items.length} />

        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <AntDesign color={theme.colors.background.accent} name="schedule" size={48} />
            </View>
            <Text style={styles.emptyTitle}>{copy.emptyTitle}</Text>
            <Text style={styles.emptyBody}>{copy.emptyBody}</Text>
            <AppButton
              icon={<AntDesign color={theme.colors.text.onBrand} name="plus" size={20} />}
              label={copy.addTask}
              onPress={() => setEditor('new')}
              style={styles.emptyButton}
            />
          </View>
        ) : (
          <>
            <ChecklistSection
              getTitle={getItemTitle}
              items={remainingItems}
              title={copy.remaining}
              onMenu={openItemActions}
              onToggle={(item) => void toggleItem(item)}
            />
            <ChecklistSection
              getTitle={getItemTitle}
              items={completedItems}
              title={copy.completed}
              onMenu={openItemActions}
              onToggle={(item) => void toggleItem(item)}
            />
          </>
        )}
      </ScrollView>

      <ChecklistTaskSheet
        item={editor === 'new' ? null : editor}
        visible={editor !== null}
        onClose={() => setEditor(null)}
        onSubmit={saveItem}
      />
    </View>
  );
}

function getNextSortOrder(items: ChecklistItem[]) {
  return items.reduce((maximum, item) => Math.max(maximum, item.sort_order), 0) + 10;
}
