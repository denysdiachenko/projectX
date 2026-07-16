import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

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
  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          minHeight: 56,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: theme.spacing.x4,
        },
        content: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing.x3,
        },
        label: {
          ...theme.typography.bodyMedium,
          flexShrink: 1,
          color: danger ? theme.colors.status.errorForeground : theme.colors.text.primary,
        },
        value: {
          ...theme.typography.bodySmall,
          color: theme.colors.text.secondary,
        },
        divider: {
          position: 'absolute',
          right: 0,
          bottom: 0,
          left: theme.spacing.x4,
          height: StyleSheet.hairlineWidth,
          backgroundColor: theme.colors.border.default,
        },
        pressed: {
          backgroundColor: theme.colors.background.subtle,
        },
      }),
    [danger, theme],
  );
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
      {divider ? <View style={styles.divider} /> : null}
    </Pressable>
  );
}
