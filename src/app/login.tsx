import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import LoginForm from '@/components/LoginForm/LoginForm';
import { createLoginStyles } from '@/components/LoginScreen/styles';
import { ROUTES } from '@/constants/routes';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { signInWithEmail } from '@/services/auth';
import type { LoginFormValues } from '@/validation-schemas/login-schema';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.login;
  const styles = useMemo(() => createLoginStyles(theme), [theme]);

  const handleLogin = async ({ email, password }: LoginFormValues) => {
    await signInWithEmail(email, password);
  };
  const handleForgotPassword = () => {};
  const handleCreateAccount = () => router.push(ROUTES.createAccount);

  return (
    <View style={styles.screen}>
      <StatusBar style={theme.statusBar} />
      <View pointerEvents="none" style={styles.violetOrb} />
      <View pointerEvents="none" style={styles.mintDot} />
      <View pointerEvents="none" style={styles.mintBar} />

      <SafeAreaView edges={['top', 'bottom']} style={styles.keyboardView}>
        <View style={styles.topNavigation}>
          <Pressable
            accessibilityLabel={copy.back}
            accessibilityRole="button"
            hitSlop={theme.spacing.x2}
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}>
            <AntDesign name="arrow-left" color={theme.colors.text.primary} size={24} />
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.intro}>
              <Text style={styles.title}>{copy.title}</Text>
              <Text style={styles.subtitle}>{copy.subtitle}</Text>
            </View>

            <LoginForm
              onCreateAccount={handleCreateAccount}
              onForgotPassword={handleForgotPassword}
              onSubmit={handleLogin}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
