import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import { createChecklistStyles } from './styles';

type ChecklistProgressProps = {
  completed: number;
  total: number;
};

export default function ChecklistProgress({ completed, total }: ChecklistProgressProps) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const styles = useMemo(() => createChecklistStyles(theme), [theme]);
  const copy = translations.checklist;
  const progress = total > 0 ? completed / total : 0;
  const progressText = copy.progress
    .replace('{completed}', String(completed))
    .replace('{total}', String(total));

  return (
    <View style={styles.summary}>
      <View style={styles.summaryTop}>
        <View style={styles.summaryIcon}>
          <AntDesign color={theme.colors.text.onBrand} name="schedule" size={22} />
        </View>
        <View style={styles.summaryCopy}>
          <Text style={styles.summaryTitle}>{copy.progressTitle}</Text>
          <Text style={styles.summaryValue}>{progressText}</Text>
        </View>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressValue, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}
