import { useMemo } from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import SkeletonBlock from './SkeletonBlock';
import SkeletonPulse from './SkeletonPulse';
import { createSkeletonStyles } from './styles';

export default function MyEventsSkeleton() {
  const theme = useAppTheme();
  const styles = useMemo(() => createSkeletonStyles(theme), [theme]);

  return (
    <SkeletonPulse style={styles.myEvents}>
      {[0, 1].map((index) => (
        <View key={index} style={styles.eventCard}>
          <SkeletonBlock style={styles.eventIcon} />
          <View style={styles.eventCopy}>
            <SkeletonBlock style={styles.titleLine} />
            <SkeletonBlock style={styles.mediumLine} />
            <SkeletonBlock style={styles.shortLine} />
          </View>
        </View>
      ))}
    </SkeletonPulse>
  );
}
