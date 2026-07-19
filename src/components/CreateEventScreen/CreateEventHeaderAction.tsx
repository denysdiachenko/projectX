import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { Pressable } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import { createCreateEventStyles } from './styles';

type CreateEventHeaderActionProps = {
  accessibilityLabel: string;
  icon: 'left' | 'close';
  onPress: () => void;
};

export default function CreateEventHeaderAction({
  accessibilityLabel,
  icon,
  onPress,
}: CreateEventHeaderActionProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createCreateEventStyles(theme), [theme]);

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}>
      <AntDesign name={icon} color={theme.colors.text.primary} size={22} />
    </Pressable>
  );
}
