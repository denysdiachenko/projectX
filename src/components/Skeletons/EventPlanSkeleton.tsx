import { useMemo } from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import SkeletonBlock from './SkeletonBlock';
import SkeletonPulse from './SkeletonPulse';
import { createSkeletonStyles } from './styles';

export default function EventPlanSkeleton() {
  const theme = useAppTheme();
  const styles = useMemo(() => createSkeletonStyles(theme), [theme]);

  return (
    <View style={styles.screen}>
      <SkeletonPulse style={styles.content}>
        <SkeletonBlock style={styles.pageTitle} />
        <SkeletonBlock style={styles.metaLine} />
        <SkeletonBlock style={styles.infoCard} />
        <SkeletonBlock style={styles.sectionHeading} />
        <SkeletonBlock style={styles.planCard} />
        <SkeletonBlock style={styles.sectionHeading} />
        <SkeletonBlock style={styles.planCardSmall} />
      </SkeletonPulse>
    </View>
  );
}
