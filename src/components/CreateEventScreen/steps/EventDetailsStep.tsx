import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { CREATE_EVENT_DURATION_OPTIONS } from '@/constants/create-event';
import { formatEventTimeInput } from '@/helpers/eventDateTime';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import { createCreateEventStyles } from '../styles';
import type {
  CreateEventDraft,
  EventLocation,
  UpdateCreateEventDraft,
} from '../types';

type EventDetailsStepProps = {
  draft: Pick<
    CreateEventDraft,
    'name' | 'date' | 'time' | 'duration' | 'customDuration' | 'location'
  >;
  error?: string;
  onOpenDate: () => void;
  onUpdate: UpdateCreateEventDraft;
};

export default function EventDetailsStep({
  draft,
  error,
  onOpenDate,
  onUpdate,
}: EventDetailsStepProps) {
  const theme = useAppTheme();
  const { language, translations } = useAppLocalization();
  const copy = translations.createEvent;
  const styles = useMemo(() => createCreateEventStyles(theme), [theme]);
  const locale = language === 'uk' ? 'uk-UA' : 'en-US';
  const dateLabel = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(draft.date);
  const month = draft.date.getMonth();
  const seasonKey = (
    month === 11 || month <= 1
      ? 'winter'
      : month <= 4
        ? 'spring'
        : month <= 7
          ? 'summer'
          : 'autumn'
  ) as keyof typeof copy.details.seasons;

  return (
    <>
      <View style={styles.intro}>
        <Text style={styles.title}>{copy.details.title}</Text>
        <Text style={styles.subtitle}>{copy.details.subtitle}</Text>
      </View>
      <View style={styles.fields}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{copy.details.name}</Text>
          <TextInput
            maxLength={120}
            onChangeText={(value) => onUpdate('name', value)}
            placeholder={copy.details.namePlaceholder}
            placeholderTextColor={theme.colors.text.muted}
            selectionColor={theme.colors.border.brand}
            style={[styles.input, error === copy.validation.eventName && styles.inputError]}
            value={draft.name}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{copy.details.date}</Text>
          <Pressable onPress={onOpenDate} style={styles.dateField}>
            <Text style={styles.dateText}>{dateLabel}</Text>
            <AntDesign name="calendar" color={theme.colors.text.secondary} size={20} />
          </Pressable>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{copy.details.time}</Text>
          <TextInput
            keyboardType="number-pad"
            maxLength={5}
            onChangeText={(value) => onUpdate('time', formatEventTimeInput(value))}
            placeholder={copy.details.timePlaceholder}
            placeholderTextColor={theme.colors.text.muted}
            selectionColor={theme.colors.border.brand}
            style={[styles.input, error === copy.validation.eventTime && styles.inputError]}
            value={draft.time}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{copy.details.duration}</Text>
          <View style={styles.durationRow}>
            {CREATE_EVENT_DURATION_OPTIONS.map((duration) => {
              const selected = draft.duration === duration;
              const label = duration === 'custom'
                ? copy.details.other
                : copy.details.durationHours.replace('{value}', String(duration));

              return (
                <Pressable
                  key={duration}
                  onPress={() => onUpdate('duration', duration)}
                  style={({ pressed }) => [
                    styles.durationOption,
                    selected && styles.durationOptionSelected,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={[styles.durationLabel, selected && styles.durationLabelSelected]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {draft.duration === 'custom' ? (
            <View>
              <View style={styles.customDurationRow}>
                <TextInput
                  keyboardType="number-pad"
                  maxLength={2}
                  onChangeText={(value) => onUpdate('customDuration', value.replace(/\D/g, ''))}
                  selectionColor={theme.colors.border.brand}
                  style={[
                    styles.input,
                    error === copy.validation.customDuration && styles.inputError,
                  ]}
                  value={draft.customDuration}
                />
                <Text style={styles.customDurationSuffix}>
                  {copy.details.durationHours.replace('{value} ', '')}
                </Text>
              </View>
              <Text style={styles.customDurationHint}>{copy.details.customDurationHint}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{copy.details.location}</Text>
          <View style={styles.locationRow}>
            {(['indoor', 'outdoor'] as EventLocation[]).map((location) => {
              const selected = draft.location === location;

              return (
                <Pressable
                  key={location}
                  onPress={() => onUpdate('location', location)}
                  style={({ pressed }) => [
                    styles.locationOption,
                    selected && styles.locationOptionSelected,
                    pressed && styles.pressed,
                  ]}>
                  <AntDesign
                    name={location === 'indoor' ? 'home' : 'compass'}
                    color={selected
                      ? theme.colors.background.brand
                      : theme.colors.text.secondary}
                    size={22}
                  />
                  <Text style={[
                    styles.locationLabel,
                    selected && styles.locationLabelSelected,
                  ]}>
                    {location === 'indoor' ? copy.details.indoor : copy.details.outdoor}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        {seasonKey === 'summer' ? (
          <View style={styles.seasonBox}>
            <AntDesign name="bulb" color={theme.colors.background.brand} size={20} />
            <Text style={styles.seasonText}>
              {copy.details.seasonHint.replace(
                '{season}',
                copy.details.seasons[seasonKey],
              )}
            </Text>
          </View>
        ) : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </>
  );
}
