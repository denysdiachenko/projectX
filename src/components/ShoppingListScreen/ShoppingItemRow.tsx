import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import {
  getMeasurementUnitLabel,
  type MeasurementUnit,
} from '@/services/measurement-units';
import type { ShoppingItem } from '@/services/shopping-list';

import { createShoppingListStyles } from './styles';

type ShoppingItemRowProps = {
  item: ShoppingItem;
  units: MeasurementUnit[];
  onDelete: () => void;
  onEdit: () => void;
  onToggle: () => void;
};

export default function ShoppingItemRow({
  item,
  units,
  onDelete,
  onEdit,
  onToggle,
}: ShoppingItemRowProps) {
  const theme = useAppTheme();
  const { language, translations } = useAppLocalization();
  const styles = useMemo(() => createShoppingListStyles(theme), [theme]);
  const copy = translations.shopping;
  const locale = language === 'uk' ? 'uk-UA' : 'en-US';
  const formatNumber = (value: number) => new Intl.NumberFormat(locale, {
    maximumFractionDigits: 3,
  }).format(value);
  const unit = getMeasurementUnitLabel(item.unit, units, language);
  const quantity = copy.itemQuantity
    .replace('{quantity}', formatNumber(item.quantity))
    .replace('{unit}', unit);
  const packageSummary = item.package_count && item.package_size
    ? copy.packageSummary
      .replace('{count}', String(item.package_count))
      .replace('{size}', formatNumber(item.package_size))
      .replace('{unit}', unit)
    : null;

  return (
    <View style={styles.itemRow}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.is_purchased }}
        hitSlop={theme.spacing.x2}
        onPress={onToggle}
        style={[styles.checkbox, item.is_purchased && styles.checkboxChecked]}>
        {item.is_purchased ? (
          <AntDesign color={theme.colors.text.onBrand} name="check" size={15} />
        ) : null}
      </Pressable>
      <View style={styles.itemCopy}>
        <Text
          numberOfLines={1}
          style={[styles.itemName, item.is_purchased && styles.itemNamePurchased]}>
          {item.name}
        </Text>
        <Text style={styles.itemMeta}>
          {packageSummary ? `${quantity} · ${packageSummary}` : quantity}
        </Text>
      </View>
      <View style={styles.itemActions}>
        <Pressable
          accessibilityLabel={copy.editItem}
          accessibilityRole="button"
          hitSlop={theme.spacing.x1}
          onPress={onEdit}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
          <AntDesign color={theme.colors.text.secondary} name="edit" size={19} />
        </Pressable>
        <Pressable
          accessibilityLabel={copy.deleteItem}
          accessibilityRole="button"
          hitSlop={theme.spacing.x1}
          onPress={onDelete}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
          <AntDesign color={theme.colors.status.errorForeground} name="delete" size={19} />
        </Pressable>
      </View>
    </View>
  );
}
