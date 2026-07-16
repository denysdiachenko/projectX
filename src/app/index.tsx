import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/app-theme';
import AppButton from "@/components/AppButton/AppButton";
import WelcomeHero from "@/components/WelcomeHero/WelcomeHero";
import SocialAuthButtons from '@/components/SocialAuthButtons/SocialAuthButtons';
import { ROUTES } from '@/constants/routes';
import { useAppLocalization } from '@/hooks/app-localization';
import createStyles from "@/app/_content/styles";

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.welcome;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleCreateAccount = () => router.push(ROUTES.createAccount);
  const handleGoogle = () => {};
  const handleApple = () => {};
  const handleLogin = () => router.push(ROUTES.login);

  return (
      <SafeAreaView edges={['bottom']} style={styles.screen}>
      <StatusBar style={theme.statusBar} />
      <View style={styles.content}>
        <WelcomeHero/>

        <View style={styles.sheet}>
          <View style={{gap: theme.spacing.x2}}>
            <Text style={styles.eyebrow}>{copy.eyebrow}</Text>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.subtitle}>{copy.subtitle}</Text>
          </View>

          <View style={styles.actions}>
            <AppButton
              label={copy.createAccount}
              variant="primary"
              onPress={handleCreateAccount}
            />
            <SocialAuthButtons
              onApplePress={handleApple}
              onGooglePress={handleGoogle}
            />
          </View>

          <View style={{gap: theme.spacing.x5}}>
            <View style={styles.loginRow}>
              <Text style={styles.loginPrompt}>{copy.existingAccount}</Text>
              <Pressable
                accessibilityRole="button"
                hitSlop={theme.spacing.x3}
                onPress={handleLogin}>
                <Text style={styles.loginLink}>{copy.login}</Text>
              </Pressable>
            </View>

            <Text style={styles.legal}>{copy.legal}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
