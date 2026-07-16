import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createMyEventsStyles } from '@/components/MyEventsScreen/styles';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

export default function MyEventsScreen() {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const styles = useMemo(() => createMyEventsStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style={theme.statusBar} />
      <View style={styles.content}>
        <Text style={styles.title}>{translations.myEvents.title}</Text>
        <Text style={styles.placeholder}>{translations.myEvents.placeholder}</Text>
      </View>
    </SafeAreaView>
  );
}
