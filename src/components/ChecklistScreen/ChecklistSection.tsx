import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';
import type { ChecklistItem } from '@/services/checklist';

import ChecklistItemRow from './ChecklistItemRow';
import { createChecklistStyles } from './styles';

type ChecklistSectionProps = {
  hintItemId?: string;
  items: ChecklistItem[];
  title: string;
  getTitle: (item: ChecklistItem) => string;
  onDelete: (item: ChecklistItem) => void;
  onEdit: (item: ChecklistItem) => void;
  onSwipeHintPlayed?: () => void;
  onToggle: (item: ChecklistItem) => void;
};

export default function ChecklistSection({
  hintItemId,
  items,
  title,
  getTitle,
  onDelete,
  onEdit,
  onSwipeHintPlayed,
  onToggle,
}: ChecklistSectionProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createChecklistStyles(theme), [theme]);

  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.itemsCard}>
        {items.map((item, index) => (
          <ChecklistItemRow
            animateSwipeHint={item.id === hintItemId}
            isLast={index === items.length - 1}
            item={item}
            key={item.id}
            title={getTitle(item)}
            onDelete={() => onDelete(item)}
            onEdit={() => onEdit(item)}
            onSwipeHintPlayed={onSwipeHintPlayed}
            onToggle={() => onToggle(item)}
          />
        ))}
      </View>
    </View>
  );
}
