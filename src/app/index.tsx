import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AntDesign } from '@react-native-vector-icons/ant-design';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/app-theme';
import WelcomeButton from "@/components/WelcomeButton/WelcomeButton";
import WelcomeHero from "@/components/WelcomeHero/WelcomeHero";
import { useAppLocalization } from '@/hooks/app-localization';
import {createStyles} from "@/app/_content/styles";

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.welcome;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleCreateAccount = () => {};
  const handleGoogle = () => {};
  const handleApple = () => {};
  const handleLogin = () => router.push('/login');

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
            <WelcomeButton
              label={copy.createAccount}
              variant="primary"
              onPress={handleCreateAccount}
            />
            <WelcomeButton
              label={copy.continueWithGoogle}
              icon={<AntDesign name="google" color={theme.colors.text.primary} size={20} />}
              onPress={handleGoogle}
            />
            <WelcomeButton
              label={copy.continueWithApple}
              icon={<AntDesign name="apple" color={theme.colors.text.primary} size={20} />}
              onPress={handleApple}
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
