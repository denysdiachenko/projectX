import { useMemo } from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import SkeletonBlock from './SkeletonBlock';
import SkeletonPulse from './SkeletonPulse';
import { createSkeletonStyles } from './styles';

export default function EventGuestsSkeleton() {
  const theme = useAppTheme();
  const styles = useMemo(() => createSkeletonStyles(theme), [theme]);

  return (
    <View style={styles.screen}>
      <SkeletonPulse style={styles.content}>
        <View style={styles.shoppingCardHeader}>
          <SkeletonBlock style={styles.pageTitle} />
          <SkeletonBlock style={styles.addLine} />
        </View>
        <SkeletonBlock style={styles.guestSummary} />
        <SkeletonBlock style={styles.checklistSectionTitle} />
        <SkeletonBlock style={styles.guestCard} />
        <SkeletonBlock style={styles.guestCard} />
        <SkeletonBlock style={styles.guestCard} />
      </SkeletonPulse>
    </View>
  );
}
