import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

export default function AppHeaderBackButton() {
  const router = useRouter();
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        button: {
          width: theme.spacing.x10,
          height: theme.spacing.x10,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme.spacing.x3,
        },
        pressed: {
          opacity: 0.76,
        },
      }),
    [theme],
  );

  return (
    <View>
      <Pressable
        accessibilityLabel={translations.profile.back}
        accessibilityRole="button"
        hitSlop={theme.spacing.x2}
        onPress={() => router.back()}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <AntDesign name="left" color={theme.colors.text.primary} size={22} />
      </Pressable>
    </View>
  );
}
