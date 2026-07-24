import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import SwipeableItemRow from '@/components/SwipeableItemRow/SwipeableItemRow';
import type { ChecklistItem } from '@/services/checklist';

import { createChecklistStyles } from './styles';

type ChecklistItemRowProps = {
  animateSwipeHint?: boolean;
  item: ChecklistItem;
  isLast: boolean;
  title: string;
  onDelete: () => void;
  onEdit: () => void;
  onSwipeHintPlayed?: () => void;
  onToggle: () => void;
};

export default function ChecklistItemRow({
  animateSwipeHint,
  item,
  isLast,
  title,
  onDelete,
  onEdit,
  onSwipeHintPlayed,
  onToggle,
}: ChecklistItemRowProps) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const styles = useMemo(() => createChecklistStyles(theme), [theme]);
  const copy = translations.checklist;

  return (
    <SwipeableItemRow
      animateSwipeHint={animateSwipeHint}
      completeAccessibilityLabel={item.is_completed
        ? copy.undoAction
        : copy.completeAction}
      deleteAccessibilityLabel={copy.deleteAction}
      isCompleted={item.is_completed}
      onComplete={onToggle}
      onDelete={onDelete}
      onSwipeHintPlayed={onSwipeHintPlayed}>
      <View style={[styles.itemRow, !isLast && styles.itemDivider]}>
        <Pressable
          accessibilityLabel={item.is_completed ? copy.markIncomplete : copy.markComplete}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.is_completed }}
          hitSlop={theme.spacing.x2}
          onPress={onToggle}
          style={({ pressed }) => [
            styles.checkbox,
            item.is_completed && styles.checkboxChecked,
            pressed && styles.pressed,
          ]}>
          {item.is_completed ? (
            <AntDesign color={theme.colors.text.onBrand} name="check" size={18} />
          ) : null}
        </Pressable>
        <Pressable
          accessibilityLabel={copy.form.editTitle}
          accessibilityRole="button"
          onPress={onEdit}
          style={({ pressed }) => [styles.itemEditArea, pressed && styles.pressed]}>
          <Text
            numberOfLines={2}
            style={[styles.itemTitle, item.is_completed && styles.itemTitleCompleted]}>
            {title}
          </Text>
        </Pressable>
      </View>
    </SwipeableItemRow>
  );
}
