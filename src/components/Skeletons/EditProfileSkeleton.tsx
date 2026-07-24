import { useMemo } from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import SkeletonBlock from './SkeletonBlock';
import SkeletonPulse from './SkeletonPulse';
import { createSkeletonStyles } from './styles';

export default function EditProfileSkeleton() {
  const theme = useAppTheme();
  const styles = useMemo(() => createSkeletonStyles(theme), [theme]);

  return (
    <View style={styles.screen}>
      <SkeletonPulse style={styles.editProfileContent}>
        <SkeletonBlock style={styles.avatarLarge} />
        <SkeletonBlock style={styles.changePhotoLine} />
        <View style={styles.formSkeleton}>
          <SkeletonBlock style={styles.inputLabel} />
          <SkeletonBlock style={styles.input} />
          <SkeletonBlock style={styles.inputLabel} />
          <SkeletonBlock style={styles.input} />
        </View>
        <SkeletonBlock style={styles.bottomButton} />
      </SkeletonPulse>
    </View>
  );
}
