import { useMemo } from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import SkeletonBlock from './SkeletonBlock';
import SkeletonPulse from './SkeletonPulse';
import { createSkeletonStyles } from './styles';

export default function EditEventSkeleton() {
  const theme = useAppTheme();
  const styles = useMemo(() => createSkeletonStyles(theme), [theme]);

  return (
    <View style={styles.editEventScreen}>
      <SkeletonPulse style={styles.editEventContent}>
        <View style={styles.progressSegments}>
          {[0, 1, 2, 3].map((index) => (
            <SkeletonBlock key={index} style={styles.progressSegment} />
          ))}
        </View>
        <SkeletonBlock style={styles.pageTitle} />
        <SkeletonBlock style={styles.metaLine} />
        {[0, 1, 2].map((index) => (
          <SkeletonBlock key={index} style={styles.optionCard} />
        ))}
      </SkeletonPulse>
    </View>
  );
}
