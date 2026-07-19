import { useMemo } from 'react';
import { Text, TextInput, View } from 'react-native';

import { ReviewCard } from '@/components/CreateEventScreen/CreateEventControls';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import { createCreateEventStyles } from '../styles';
import type {
  CreateEventDraft,
  CreateEventStep,
  UpdateCreateEventDraft,
} from '../types';

type ReviewStepProps = {
  draft: CreateEventDraft;
  onEdit: (step: CreateEventStep) => void;
  onUpdate: UpdateCreateEventDraft;
};

export default function ReviewStep({ draft, onEdit, onUpdate }: ReviewStepProps) {
  const theme = useAppTheme();
  const { language, translations } = useAppLocalization();
  const copy = translations.createEvent;
  const styles = useMemo(() => createCreateEventStyles(theme), [theme]);
  const locale = language === 'uk' ? 'uk-UA' : 'en-US';
  const totalGuests = draft.adults + draft.children;
  const durationValue = draft.duration === 'custom'
    ? Number(draft.customDuration)
    : draft.duration;
  const durationLabel = copy.details.durationHours.replace(
    '{value}',
    Number.isFinite(durationValue) ? String(durationValue) : '—',
  );
  const dateLabel = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(draft.date);
  const locationLabel = draft.location === 'indoor'
    ? copy.details.indoor
    : copy.details.outdoor;
  const selectedDrinkLabels = draft.drinks.map((drink) => copy.menu[drink]).join(', ');

  return (
    <>
      <View style={styles.intro}>
        <Text style={styles.title}>{copy.review.title}</Text>
        <Text style={styles.subtitle}>{copy.review.subtitle}</Text>
      </View>
      <View style={styles.reviewCards}>
        <ReviewCard
          changeLabel={copy.review.change}
          hint={`${dateLabel} · ${durationLabel} · ${locationLabel.toLocaleLowerCase(locale)}`}
          icon="calendar"
          title={draft.name || copy.eventType[draft.eventType]}
          onPress={() => onEdit(2)}
        />
        <ReviewCard
          changeLabel={copy.review.change}
          hint={copy.guests.breakdown
            .replace('{adults}', String(draft.adults))
            .replace('{children}', String(draft.children))}
          icon="team"
          title={copy.review.guestsSummary.replace('{total}', String(totalGuests))}
          onPress={() => onEdit(1)}
        />
        <ReviewCard
          changeLabel={copy.review.change}
          hint={selectedDrinkLabels}
          icon="star"
          title={copy.menu[draft.menuFormat]}
          onPress={() => onEdit(3)}
        />
      </View>
      <View style={styles.reviewFields}>
        <View style={styles.fieldGroup}>
          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>{copy.review.budget}</Text>
            <Text style={styles.optional}>{copy.review.optional}</Text>
          </View>
          <View>
            <TextInput
              keyboardType="number-pad"
              onChangeText={(value) => onUpdate('budget', value.replace(/[^\d\s]/g, ''))}
              placeholder={copy.review.budgetPlaceholder}
              placeholderTextColor={theme.colors.text.muted}
              selectionColor={theme.colors.border.brand}
              style={styles.input}
              value={draft.budget}
            />
            <Text style={styles.customDurationSuffix}>{copy.review.currency}</Text>
          </View>
        </View>
        <View style={styles.fieldGroup}>
          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>{copy.review.note}</Text>
            <Text style={styles.optional}>{copy.review.optional}</Text>
          </View>
          <TextInput
            maxLength={300}
            multiline
            onChangeText={(value) => onUpdate('note', value)}
            placeholder={copy.review.notePlaceholder}
            placeholderTextColor={theme.colors.text.muted}
            selectionColor={theme.colors.border.brand}
            style={[styles.input, styles.multilineInput]}
            value={draft.note}
          />
        </View>
      </View>
    </>
  );
}
