import { Image } from 'expo-image';
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/hooks/app-theme';

import { createLegalPlaceholderStyles } from './legalPlaceholderStyles';

type LegalPlaceholderScreenProps = {
  title: string;
  message: string;
};

export default function LegalPlaceholderScreen({
  title,
  message,
}: LegalPlaceholderScreenProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createLegalPlaceholderStyles(theme), [theme]);

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.illustration}>
          <Image
            contentFit="contain"
            source={require('../../../assets/svg/ic_documnt.svg')}
            style={styles.document}
          />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}
