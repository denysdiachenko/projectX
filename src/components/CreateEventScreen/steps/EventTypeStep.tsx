import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { SelectionCard } from '@/components/CreateEventScreen/CreateEventControls';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import { createCreateEventStyles } from '../styles';
import type { EventType } from '../types';

type EventTypeStepProps = {
  value: EventType;
  onChange: (value: EventType) => void;
};

export default function EventTypeStep({ value, onChange }: EventTypeStepProps) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.createEvent.eventType;
  const styles = useMemo(() => createCreateEventStyles(theme), [theme]);

  return (
    <>
      <View style={styles.intro}>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.subtitle}>{copy.subtitle}</Text>
      </View>
      <View style={styles.optionsList}>
        <SelectionCard
          hint={copy.birthdayHint}
          icon="gift"
          label={copy.birthday}
          selected={value === 'birthday'}
          onPress={() => onChange('birthday')}
        />
        <SelectionCard
          hint={copy.bbqHint}
          icon="fire"
          label={copy.bbq}
          selected={value === 'bbq'}
          onPress={() => onChange('bbq')}
        />
        <SelectionCard
          hint={copy.homePartyHint}
          icon="home"
          label={copy.homeParty}
          selected={value === 'homeParty'}
          onPress={() => onChange('homeParty')}
        />
      </View>
    </>
  );
}
