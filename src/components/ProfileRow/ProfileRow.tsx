import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import createStyles from './styles';

type ProfileRowProps = {
  label: string;
  value?: string;
  danger?: boolean;
  divider?: boolean;
  onPress: () => void;
};

export default function ProfileRow({
  label,
  value,
  danger = false,
  divider = false,
  onPress,
}: ProfileRowProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme, { danger, divider }), [danger, divider, theme]);
  const iconColor = danger ? theme.colors.status.errorForeground : theme.colors.text.muted;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        {value ? <Text style={styles.value}>{value}</Text> : null}
      </View>
      <AntDesign name="right" color={iconColor} size={16} />
    </Pressable>
  );
}
