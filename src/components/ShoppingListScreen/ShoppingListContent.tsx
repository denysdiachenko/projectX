import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import { EVENT_TAB_BAR_HEIGHT } from '@/constants/event-tabs';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import {
  createShoppingItem,
  deleteShoppingItem,
  getShoppingList,
  setShoppingItemPurchased,
  type ShoppingItem,
  type ShoppingItemValues,
  type ShoppingTarget,
  updateShoppingItem,
} from '@/services/shopping-list';
import { showToast } from '@/services/toast';

import ShoppingItemRow from './ShoppingItemRow';
import ShoppingItemSheet from './ShoppingItemSheet';
import ShoppingFlatList from './ShoppingFlatList';
import ShoppingTargetSection from './ShoppingTargetSection';
import ShoppingViewToggle, { type ShoppingViewMode } from './ShoppingViewToggle';
import { createShoppingListStyles } from './styles';

type ShoppingListData = Awaited<ReturnType<typeof getShoppingList>>;

type EditorState = {
  item: ShoppingItem | null;
  target: ShoppingTarget | null;
};

export default function ShoppingListContent({ eventId }: { eventId: string }) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { language, translations } = useAppLocalization();
  const styles = useMemo(
    () => createShoppingListStyles(theme, 0, EVENT_TAB_BAR_HEIGHT + insets.bottom),
    [insets.bottom, theme],
  );
  const copy = translations.shopping;
  const [data, setData] = useState<ShoppingListData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [viewMode, setViewMode] = useState<ShoppingViewMode>('grouped');

  const loadShoppingList = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      setData(await getShoppingList(eventId));
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useFocusEffect(useCallback(() => {
    let active = true;

    void getShoppingList(eventId)
      .then((nextData) => {
        if (active) {
          setData(nextData);
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

  const saveItem = async (values: ShoppingItemValues) => {
    if (!editor || !data) return;
    if (!editor.item && !editor.target) return;

    try {
      const savedItem = editor.item
        ? await updateShoppingItem(editor.item.id, values)
        : await createShoppingItem({
          eventId,
          planTargetId: editor.target!.id,
          sortOrder: data.items.length,
          values,
        });

      setData((current) => current ? {
        ...current,
        items: editor.item
          ? current.items.map((item) => item.id === savedItem.id ? savedItem : item)
          : [...current.items, savedItem],
      } : current);
      setEditor(null);
    } catch {
      showToast({
        message: copy.saveErrorMessage,
        title: copy.saveErrorTitle,
        type: 'error',
      });
    }
  };

  const toggleItem = async (item: ShoppingItem) => {
    const nextPurchased = !item.is_purchased;
    setData((current) => current ? {
      ...current,
      items: current.items.map((entry) => entry.id === item.id
        ? { ...entry, is_purchased: nextPurchased }
        : entry),
    } : current);

    try {
      const updated = await setShoppingItemPurchased(item.id, nextPurchased);
      setData((current) => current ? {
        ...current,
        items: current.items.map((entry) => entry.id === updated.id ? updated : entry),
      } : current);
    } catch {
      setData((current) => current ? {
        ...current,
        items: current.items.map((entry) => entry.id === item.id ? item : entry),
      } : current);
      showToast({
        message: copy.toggleErrorMessage,
        title: copy.toggleErrorTitle,
        type: 'error',
      });
    }
  };

  const requestDelete = (item: ShoppingItem) => {
    Alert.alert(copy.deleteConfirmTitle, copy.deleteConfirmMessage, [
      { style: 'cancel', text: copy.form.cancel },
      {
        style: 'destructive',
        text: copy.deleteConfirm,
        onPress: () => {
          void deleteShoppingItem(item.id)
            .then(() => {
              setData((current) => current ? {
                ...current,
                items: current.items.filter((entry) => entry.id !== item.id),
              } : current);
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

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.state]}>
        <StatusBar barStyle={theme.statusBar === 'dark' ? 'dark-content' : 'light-content'} />
        <ActivityIndicator color={theme.colors.background.brand} size="large" />
      </View>
    );
  }

  if (hasError || !data) {
    return (
      <View style={[styles.screen, styles.state]}>
        <Text style={styles.stateTitle}>{copy.loadError}</Text>
        <AppButton
          label={copy.retry}
          onPress={() => void loadShoppingList()}
          style={styles.retryButton}
        />
      </View>
    );
  }

  const targetIds = new Set(data.targets.map((target) => target.id));
  const previousItems = data.items.filter(
    (item) => !item.plan_target_id || !targetIds.has(item.plan_target_id),
  );
  const purchasedCount = data.items.filter((item) => item.is_purchased).length;
  const progressText = copy.progress
    .replace('{purchased}', String(purchasedCount))
    .replace('{total}', String(data.items.length));
  const editorCategory = editor?.target
    ? translations.eventPlan.categories[editor.target.category] ?? editor.target.category
    : copy.previousItemsTitle;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle={theme.statusBar === 'dark' ? 'dark-content' : 'light-content'} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{copy.title}</Text>
        <View style={styles.summary}>
          <View style={styles.summaryIcon}>
            <AntDesign color={theme.colors.text.onBrand} name="shopping-cart" size={22} />
          </View>
          <View style={styles.summaryCopy}>
            <Text style={styles.summaryTitle}>{copy.progressTitle}</Text>
            <Text style={styles.summaryProgress}>{progressText}</Text>
          </View>
        </View>
        <ShoppingViewToggle value={viewMode} onChange={setViewMode} />

        {data.items.length === 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{copy.emptyTitle}</Text>
              <Text style={styles.previousBody}>{copy.emptyBody}</Text>
            </View>
          </View>
        ) : null}

        {viewMode === 'grouped' ? (
          <>
            {data.targets.map((target) => (
              <ShoppingTargetSection
                items={data.items.filter((item) => item.plan_target_id === target.id)}
                key={target.id}
                target={target}
                units={data.units}
                onAdd={() => setEditor({ item: null, target })}
                onDelete={requestDelete}
                onEdit={(item) => setEditor({ item, target })}
                onToggle={(item) => void toggleItem(item)}
              />
            ))}

            {previousItems.length > 0 ? (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{copy.previousItemsTitle}</Text>
                  <Text style={styles.previousBody}>{copy.previousItemsBody}</Text>
                </View>
                {previousItems.map((item) => (
                  <ShoppingItemRow
                    item={item}
                    key={item.id}
                    units={data.units}
                    onDelete={() => requestDelete(item)}
                    onEdit={() => setEditor({ item, target: null })}
                    onToggle={() => void toggleItem(item)}
                  />
                ))}
              </View>
            ) : null}
          </>
        ) : (
          <ShoppingFlatList
            items={data.items}
            units={data.units}
            onDelete={requestDelete}
            onEdit={(item) => setEditor({
              item,
              target: data.targets.find((target) => target.id === item.plan_target_id) ?? null,
            })}
            onToggle={(item) => void toggleItem(item)}
          />
        )}
      </ScrollView>

      <ShoppingItemSheet
        categoryLabel={editorCategory}
        item={editor?.item ?? null}
        language={language}
        units={data.units}
        target={editor?.target ?? null}
        visible={Boolean(editor)}
        onClose={() => setEditor(null)}
        onSubmit={saveItem}
      />
    </View>
  );
}
