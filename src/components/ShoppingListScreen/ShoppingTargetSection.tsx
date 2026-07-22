import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { convertShoppingQuantity } from '@/helpers/shoppingQuantity';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import {
  getMeasurementUnitLabel,
  type MeasurementUnit,
} from '@/services/measurement-units';
import type { ShoppingItem, ShoppingTarget } from '@/services/shopping-list';

import ShoppingItemRow from './ShoppingItemRow';
import { createShoppingListStyles } from './styles';

type ShoppingTargetSectionProps = {
  items: ShoppingItem[];
  target: ShoppingTarget;
  units: MeasurementUnit[];
  onAdd: () => void;
  onDelete: (item: ShoppingItem) => void;
  onEdit: (item: ShoppingItem) => void;
  onToggle: (item: ShoppingItem) => void;
};

export default function ShoppingTargetSection({
  items,
  target,
  units,
  onAdd,
  onDelete,
  onEdit,
  onToggle,
}: ShoppingTargetSectionProps) {
  const theme = useAppTheme();
  const { language, translations } = useAppLocalization();
  const styles = useMemo(() => createShoppingListStyles(theme), [theme]);
  const copy = translations.shopping;
  const locale = language === 'uk' ? 'uk-UA' : 'en-US';
  const formatNumber = (value: number) => new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(value);
  const planned = items.reduce(
    (total, item) => total + convertShoppingQuantity(
      item.quantity,
      item.unit,
      target.unit,
      units,
    ),
    0,
  );
  const progress = target.targetQuantity > 0 ? Math.min(planned / target.targetQuantity, 1) : 0;
  const unit = getMeasurementUnitLabel(target.unit, units, language);
  const progressText = copy.targetProgress
    .replace('{planned}', formatNumber(planned))
    .replace('{target}', formatNumber(target.targetQuantity))
    .replace('{unit}', unit);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderTop}>
          <Text style={styles.sectionTitle}>
            {translations.eventPlan.categories[target.category] ?? target.category}
          </Text>
          <Pressable
            accessibilityLabel={copy.addItem}
            accessibilityRole="button"
            onPress={onAdd}
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
            <AntDesign color={theme.colors.text.brand} name="plus" size={16} />
            <Text style={styles.addButtonLabel}>{copy.addItem}</Text>
          </Pressable>
        </View>
        <Text style={styles.targetProgress}>{progressText}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressValue, { width: `${progress * 100}%` }]} />
        </View>
      </View>
      {items.length === 0 ? (
        <Text style={styles.noItems}>{copy.noItems}</Text>
      ) : items.map((item) => (
        <ShoppingItemRow
          item={item}
          key={item.id}
          units={units}
          onDelete={() => onDelete(item)}
          onEdit={() => onEdit(item)}
          onToggle={() => onToggle(item)}
        />
      ))}
    </View>
  );
}
