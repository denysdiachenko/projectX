import { useMemo } from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import SkeletonBlock from './SkeletonBlock';
import SkeletonPulse from './SkeletonPulse';
import { createSkeletonStyles } from './styles';

export default function ChecklistSkeleton() {
  const theme = useAppTheme();
  const styles = useMemo(() => createSkeletonStyles(theme), [theme]);

  return (
    <View style={styles.screen}>
      <SkeletonPulse style={styles.content}>
        <View style={styles.shoppingCardHeader}>
          <SkeletonBlock style={styles.pageTitle} />
          <SkeletonBlock style={styles.addLine} />
        </View>
        <SkeletonBlock style={styles.checklistSummary} />
        <SkeletonBlock style={styles.checklistSectionTitle} />
        <SkeletonBlock style={styles.checklistCard} />
        <SkeletonBlock style={styles.checklistSectionTitle} />
        <SkeletonBlock style={styles.checklistCardSmall} />
      </SkeletonPulse>
    </View>
  );
}
