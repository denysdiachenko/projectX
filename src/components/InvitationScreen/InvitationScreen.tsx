import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getStringRouteParam } from '@/helpers/getStringRouteParam';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import { createInvitationStyles } from './styles';

export default function InvitationScreen() {
  const { token: tokenParam } = useLocalSearchParams<{ token?: string | string[] }>();
  const token = getStringRouteParam(tokenParam);
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.invitation;
  const styles = useMemo(() => createInvitationStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style={theme.statusBar} />
      <View style={styles.card}>
        <Text style={styles.eyebrow}>PARTY PLANER</Text>
        <Text style={styles.title}>{token ? copy.title : copy.missingTitle}</Text>
        <Text style={styles.message}>
          {token ? copy.receivedMessage : copy.missingMessage}
        </Text>
      </View>
    </SafeAreaView>
  );
}
