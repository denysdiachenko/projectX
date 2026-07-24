import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import type { ChecklistItem } from '@/services/checklist';

import { createChecklistStyles } from './styles';

type ChecklistItemRowProps = {
  item: ChecklistItem;
  isLast: boolean;
  title: string;
  onMenu: () => void;
  onToggle: () => void;
};

export default function ChecklistItemRow({
  item,
  isLast,
  title,
  onMenu,
  onToggle,
}: ChecklistItemRowProps) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const styles = useMemo(() => createChecklistStyles(theme), [theme]);
  const copy = translations.checklist;

  return (
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
      <Text
        numberOfLines={2}
        style={[styles.itemTitle, item.is_completed && styles.itemTitleCompleted]}>
        {title}
      </Text>
      <Pressable
        accessibilityLabel={copy.openTaskActions}
        accessibilityRole="button"
        hitSlop={theme.spacing.x2}
        onPress={onMenu}
        style={({ pressed }) => [styles.itemMenu, pressed && styles.pressed]}>
        <AntDesign color={theme.colors.text.muted} name="ellipsis" size={22} />
      </Pressable>
    </View>
  );
}
