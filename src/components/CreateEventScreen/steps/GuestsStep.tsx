import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { CounterRow } from '@/components/CreateEventScreen/CreateEventControls';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import { createCreateEventStyles } from '../styles';
import type { CreateEventDraft, UpdateCreateEventDraft } from '../types';

type GuestsStepProps = {
  draft: Pick<CreateEventDraft, 'adults' | 'children' | 'alcoholGuests'>;
  error?: string;
  onUpdate: UpdateCreateEventDraft;
};

export default function GuestsStep({ draft, error, onUpdate }: GuestsStepProps) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.createEvent.guests;
  const styles = useMemo(() => createCreateEventStyles(theme), [theme]);
  const totalGuests = draft.adults + draft.children;

  return (
    <>
      <View style={styles.intro}>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.subtitle}>{copy.subtitle}</Text>
      </View>
      <View style={styles.totalCard}>
        <View style={styles.totalCopy}>
          <Text style={styles.totalLabel}>{copy.total}</Text>
          <Text style={styles.totalHint}>
            {copy.breakdown
              .replace('{adults}', String(draft.adults))
              .replace('{children}', String(draft.children))}
          </Text>
        </View>
        <Text style={styles.totalValue}>{totalGuests}</Text>
      </View>
      <View style={styles.counters}>
        <CounterRow
          hint={copy.adultsHint}
          label={copy.adults}
          value={draft.adults}
          onChange={(value) => {
            onUpdate('adults', value);
            onUpdate('alcoholGuests', Math.min(draft.alcoholGuests, value));
          }}
        />
        <CounterRow
          hint={copy.childrenHint}
          label={copy.children}
          value={draft.children}
          onChange={(value) => onUpdate('children', value)}
        />
        <CounterRow
          hint={copy.alcoholHint.replace('{max}', String(draft.adults))}
          label={copy.alcohol}
          max={draft.adults}
          value={draft.alcoholGuests}
          onChange={(value) => onUpdate('alcoholGuests', value)}
        />
      </View>
      <View style={styles.infoBox}>
        <AntDesign name="info-circle" color={theme.colors.background.brand} size={20} />
        <Text style={styles.infoText}>{copy.validationHint}</Text>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </>
  );
}
