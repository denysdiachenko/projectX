import { useMemo } from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import SkeletonBlock from './SkeletonBlock';
import SkeletonPulse from './SkeletonPulse';
import { createSkeletonStyles } from './styles';

export default function ProfileSkeleton() {
  const theme = useAppTheme();
  const styles = useMemo(() => createSkeletonStyles(theme), [theme]);

  return (
    <View style={styles.screen}>
      <SkeletonPulse style={styles.profileContent}>
        <SkeletonBlock style={styles.avatar} />
        <SkeletonBlock style={styles.profileName} />
        <SkeletonBlock style={styles.profileEmail} />
        <SkeletonBlock style={styles.button} />
        {[0, 1, 2].map((index) => (
          <View key={index} style={styles.profileSection}>
            <SkeletonBlock style={styles.sectionLabel} />
            <SkeletonBlock style={styles.profileGroup} />
          </View>
        ))}
      </SkeletonPulse>
    </View>
  );
}
