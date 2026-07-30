import { useMemo, type PropsWithChildren } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import AppChevron from '@/components/AppChevron/AppChevron';
import { useAppTheme } from '@/hooks/app-theme';

import { createAuthFlowScreenStyles } from './styles';

type AuthFlowScreenProps = PropsWithChildren<{
  backLabel: string;
  onBack: () => void;
  subtitle: string;
  title: string;
}>;

export default function AuthFlowScreen({
  backLabel,
  children,
  onBack,
  subtitle,
  title,
}: AuthFlowScreenProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createAuthFlowScreenStyles(theme), [theme]);

  return (
    <View style={styles.screen}>
      <StatusBar style={theme.statusBar} />
      <View pointerEvents="none" style={styles.violetOrb} />
      <View pointerEvents="none" style={styles.mintDot} />

      <SafeAreaView edges={['top', 'bottom']} style={styles.fill}>
        <View style={styles.topNavigation}>
          <Pressable
            accessibilityLabel={backLabel}
            accessibilityRole="button"
            hitSlop={theme.spacing.x2}
            onPress={onBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}>
            <AppChevron color={theme.colors.text.primary} direction="left" size={24} />
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.fill}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.intro}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
