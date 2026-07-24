import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';
import type { ChecklistItem } from '@/services/checklist';

import ChecklistItemRow from './ChecklistItemRow';
import { createChecklistStyles } from './styles';

type ChecklistSectionProps = {
  items: ChecklistItem[];
  title: string;
  getTitle: (item: ChecklistItem) => string;
  onMenu: (item: ChecklistItem) => void;
  onToggle: (item: ChecklistItem) => void;
};

export default function ChecklistSection({
  items,
  title,
  getTitle,
  onMenu,
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
            isLast={index === items.length - 1}
            item={item}
            key={item.id}
            title={getTitle(item)}
            onMenu={() => onMenu(item)}
            onToggle={() => onToggle(item)}
          />
        ))}
      </View>
    </View>
  );
}
