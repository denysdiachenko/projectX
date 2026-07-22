import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import type { EventPlanDetails } from '@/services/event-plan';
import {
  getMeasurementUnitLabel,
  type MeasurementUnit,
} from '@/services/measurement-units';

import { createEventPlanStyles } from './styles';

type PlanTarget = EventPlanDetails['targets'][number];

type PlanTargetGroupProps = {
  targets: PlanTarget[];
  title: string;
  units: MeasurementUnit[];
};

export default function PlanTargetGroup({ targets, title, units }: PlanTargetGroupProps) {
  const theme = useAppTheme();
  const { language, translations } = useAppLocalization();
  const styles = useMemo(() => createEventPlanStyles(theme), [theme]);
  const locale = language === 'uk' ? 'uk-UA' : 'en-US';
  const copy = translations.eventPlan;

  if (targets.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.targetCard}>
        {targets.map((target, index) => (
          <View key={target.id}>
            <View style={styles.targetRow}>
              <Text style={styles.targetLabel}>
                {copy.categories[target.category] ?? target.category}
              </Text>
              <Text style={styles.targetValue}>
                {new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(
                  target.targetQuantity,
                )}{' '}
                {getMeasurementUnitLabel(target.unit, units, language)}
              </Text>
            </View>
            {index < targets.length - 1 ? <View style={styles.divider} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}
