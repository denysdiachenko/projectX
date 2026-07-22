import { AntDesign } from '@react-native-vector-icons/ant-design';
import { Image } from 'expo-image';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import { createMyEventsStyles } from './styles';

export default function MyEventsEmptyState() {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.myEvents;
  const styles = useMemo(() => createMyEventsStyles(theme), [theme]);

  return (
    <>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.illustration}>
        <Image
          contentFit="contain"
          source={require('../../../assets/svg/ic_empty_calendar.svg')}
          style={styles.illustrationAsset}
        />
      </View>

      <Text style={styles.emptyTitle}>{copy.emptyTitle}</Text>
      <Text style={styles.emptyBody}>{copy.emptyBody}</Text>

      <View style={styles.hint}>
        <View style={styles.hintIcon}>
          <AntDesign name="star" color={theme.colors.background.brand} size={28} />
        </View>
        <View style={styles.hintCopy}>
          <Text style={styles.hintTitle}>{copy.hintTitle}</Text>
          <Text style={styles.hintBody}>{copy.hintBody}</Text>
        </View>
      </View>
    </>
  );
}
