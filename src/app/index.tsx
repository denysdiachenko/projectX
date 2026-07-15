import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@react-native-vector-icons/ant-design';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type AppTheme, useAppTheme } from '@/hooks/app-theme';
import WelcomeButton from "@/components/WelcomeButton/WelcomeButton";
import WelcomeHero from "@/components/WelcomeHero/WelcomeHero";

export default function WelcomeScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleCreateAccount = () => {};
  const handleGoogle = () => {};
  const handleApple = () => {};
  const handleLogin = () => {};

  return (
      <SafeAreaView edges={['bottom']} style={styles.screen}>
      <StatusBar style={theme.statusBar} />
      <View style={styles.content}>
        <WelcomeHero/>

        <View style={styles.sheet}>
          <View style={{gap: theme.spacing.x2}}>
            <Text style={styles.eyebrow}>ВЕЧІРКА БЕЗ СТРЕСУ</Text>
            <Text style={styles.title}>Сплануй вечірку{`\n`}за кілька хвилин</Text>
            <Text style={styles.subtitle}>
              Розрахуємо їжу, напої та покупки — тобі залишиться лише відмічати готове.
            </Text>
          </View>

          <View style={styles.actions}>
            <WelcomeButton
              label="Створити акаунт"
              variant="primary"
              onPress={handleCreateAccount}
            />
            <WelcomeButton
              label="Продовжити з Google"
              icon={<AntDesign name="google" color={theme.colors.text.primary} size={20} />}
              onPress={handleGoogle}
            />
            <WelcomeButton
              label="Продовжити з Apple"
              icon={<AntDesign name="apple" color={theme.colors.text.primary} size={20} />}
              onPress={handleApple}
            />
          </View>

          <View style={{gap: theme.spacing.x5}}>
            <View style={styles.loginRow}>
              <Text style={styles.loginPrompt}>Вже є акаунт?</Text>
              <Pressable
                accessibilityRole="button"
                hitSlop={theme.spacing.x3}
                onPress={handleLogin}>
                <Text style={styles.loginLink}>Увійти</Text>
              </Pressable>
            </View>

            <Text style={styles.legal}>
              Продовжуючи, ти погоджуєшся з Умовами та Політикою конфіденційності
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background.surface,
    },
    content: {
      flex: 1,
      gap: spacing.x6,
      backgroundColor:colors.background.canvas,
    },
    sheet: {
      height: 462,
      padding: spacing.x6,
      borderTopLeftRadius: spacing.x8,
      borderTopRightRadius: spacing.x8,
      backgroundColor: colors.background.surface,
      gap: spacing.x5,
    },
    eyebrow: {
      ...typography.overline,
      color: colors.text.brand,
    },
    title: {
      ...typography.heading2,
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.bodySmall,
      color: colors.text.secondary,
    },
    actions: {
      gap: spacing.x3,
    },
    loginRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.x1,
    },
    loginPrompt: {
      ...typography.caption,
      color: colors.text.secondary,
    },
    loginLink: {
      ...typography.labelSmall,
      color: colors.text.brand,
    },
    legal: {
      ...typography.overline,
      color: colors.text.muted,
      textAlign: 'center',
      letterSpacing: 0,
    },
  });
}

