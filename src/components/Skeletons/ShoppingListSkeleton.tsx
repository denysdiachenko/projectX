import { useMemo } from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import SkeletonBlock from './SkeletonBlock';
import SkeletonPulse from './SkeletonPulse';
import { createSkeletonStyles } from './styles';

export default function ShoppingListSkeleton() {
  const theme = useAppTheme();
  const styles = useMemo(() => createSkeletonStyles(theme), [theme]);

  return (
    <View style={styles.screen}>
      <SkeletonPulse style={styles.content}>
        <SkeletonBlock style={styles.pageTitle} />
        <SkeletonBlock style={styles.shoppingSummary} />
        <SkeletonBlock style={styles.toggle} />
        {[0, 1, 2].map((index) => (
          <View key={index} style={styles.shoppingCard}>
            <View style={styles.shoppingCardHeader}>
              <SkeletonBlock style={styles.titleLine} />
              <SkeletonBlock style={styles.addLine} />
            </View>
            <SkeletonBlock style={styles.mediumLine} />
            <SkeletonBlock style={styles.progressLine} />
            <SkeletonBlock style={styles.longLine} />
          </View>
        ))}
      </SkeletonPulse>
    </View>
  );
}
