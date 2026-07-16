import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CreateAccountForm from '@/components/CreateAccountForm/CreateAccountForm';
import { createLoginStyles } from '@/components/LoginScreen/styles';
import { ROUTES } from '@/constants/routes';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { signUpWithEmail } from '@/services/auth';
import { showToast } from '@/services/toast';
import type { CreateAccountFormValues } from '@/validation-schemas/create-account-schema';

export default function CreateAccountScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { language, translations } = useAppLocalization();
  const copy = translations.createAccount;
  const styles = useMemo(() => createLoginStyles(theme), [theme]);

  const handleCreateAccount = async ({
    displayName,
    email,
    password,
  }: CreateAccountFormValues) => {
    const { session } = await signUpWithEmail({ displayName, email, locale: language, password });

    if (session) {
      showToast({ message: copy.success, title: copy.successTitle, type: 'success' });
      return;
    }

    showToast({
      message: copy.confirmationMessage,
      title: copy.confirmationTitle,
      type: 'success',
    });
    router.replace(ROUTES.login);
  };
  const handleLogin = () => router.replace(ROUTES.login);

  return (
    <View style={styles.screen}>
      <StatusBar style={theme.statusBar} />
      <View pointerEvents="none" style={styles.violetOrb} />
      <View pointerEvents="none" style={styles.mintDot} />
      <View pointerEvents="none" style={styles.mintBar} />

      <SafeAreaView edges={['top']} style={styles.keyboardView}>
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

            <CreateAccountForm
              onLogin={handleLogin}
              onSubmit={handleCreateAccount}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
