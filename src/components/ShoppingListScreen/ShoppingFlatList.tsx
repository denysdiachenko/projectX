import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import type { MeasurementUnit } from '@/services/measurement-units';
import type { ShoppingItem } from '@/services/shopping-list';

import ShoppingItemRow from './ShoppingItemRow';
import { createShoppingListStyles } from './styles';

type ShoppingFlatListProps = {
  hintItemId?: string;
  items: ShoppingItem[];
  units: MeasurementUnit[];
  onDelete: (item: ShoppingItem) => void;
  onEdit: (item: ShoppingItem) => void;
  onSwipeHintPlayed?: () => void;
  onToggle: (item: ShoppingItem) => void;
};

export default function ShoppingFlatList({
  hintItemId,
  items,
  units,
  onDelete,
  onEdit,
  onSwipeHintPlayed,
  onToggle,
}: ShoppingFlatListProps) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const styles = useMemo(() => createShoppingListStyles(theme), [theme]);

  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{translations.shopping.allItemsTitle}</Text>
      </View>
      {items.map((item) => (
        <ShoppingItemRow
          animateSwipeHint={item.id === hintItemId}
          item={item}
          key={item.id}
          units={units}
          onDelete={() => onDelete(item)}
          onEdit={() => onEdit(item)}
          onSwipeHintPlayed={onSwipeHintPlayed}
          onToggle={() => onToggle(item)}
        />
      ))}
    </View>
  );
}
