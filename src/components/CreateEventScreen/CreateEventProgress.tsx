import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { CREATE_EVENT_TOTAL_STEPS } from '@/constants/create-event';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import { createCreateEventStyles } from './styles';
import type { CreateEventStep } from './types';

export default function CreateEventProgress({ step }: { step: CreateEventStep }) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.createEvent;
  const styles = useMemo(() => createCreateEventStyles(theme), [theme]);
  const stepNames = [
    copy.steps.eventType,
    copy.steps.guests,
    copy.steps.details,
    copy.steps.menu,
    copy.steps.review,
  ];

  return (
    <View style={styles.progress}>
      <View style={styles.progressLabels}>
        <Text style={styles.progressCount}>
          {copy.step
            .replace('{current}', String(step + 1))
            .replace('{total}', String(CREATE_EVENT_TOTAL_STEPS))}
        </Text>
        <Text style={styles.progressName}>{stepNames[step]}</Text>
      </View>
      <View style={styles.progressSegments}>
        {stepNames.map((name, index) => (
          <View
            key={name}
            style={[styles.progressSegment, index <= step && styles.progressSegmentActive]}
          />
        ))}
      </View>
    </View>
  );
}
