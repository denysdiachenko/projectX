import { yupResolver } from '@hookform/resolvers/yup';
import { AntDesign } from '@react-native-vector-icons/ant-design';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import AppInput from '@/components/AppInput/AppInput';
import { getStringRouteParam } from '@/helpers/getStringRouteParam';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import {
  createResponseKey,
  getPublicInvitation,
  submitInvitationResponse,
  type PublicInvitation,
  type RsvpStatus,
} from '@/services/invitations';
import {
  createInvitationResponseSchema,
  type InvitationResponseFormValues,
} from '@/validation-schemas/invitation-response-schema';

import { createInvitationStyles } from './styles';

type ScreenState = 'form' | 'landing' | 'success';

export default function InvitationScreen() {
  const { token: tokenParam } = useLocalSearchParams<{ token?: string | string[] }>();
  const token = getStringRouteParam(tokenParam);
  const theme = useAppTheme();
  const { language, translations } = useAppLocalization();
  const copy = translations.invitation;
  const styles = useMemo(() => createInvitationStyles(theme), [theme]);
  const schema = useMemo(
    () => createInvitationResponseSchema({
      name: copy.validationName,
      partySize: copy.validationPartySize,
    }),
    [copy.validationName, copy.validationPartySize],
  );
  const [invitation, setInvitation] = useState<PublicInvitation | null>(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [unavailable, setUnavailable] = useState(!token);
  const [screenState, setScreenState] = useState<ScreenState>('landing');
  const [responseKey, setResponseKey] = useState(createResponseKey);
  const [submitError, setSubmitError] = useState(false);
  const {
    control,
    formState: { errors, isSubmitting },
    getValues,
    handleSubmit,
    reset,
    setValue,
  } = useForm<InvitationResponseFormValues>({
    defaultValues: {
      adultsCount: 1,
      childrenCount: 0,
      name: '',
      status: 'accepted',
    },
    resolver: yupResolver(schema),
  });

  const [adultsCount, childrenCount, name, status] = useWatch({
    control,
    name: ['adultsCount', 'childrenCount', 'name', 'status'],
  });

  useEffect(() => {
    if (!token) return;

    let active = true;

    void getPublicInvitation(token)
      .then((result) => {
        if (active) setInvitation(result);
      })
      .catch(() => {
        if (active) setUnavailable(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const submit = handleSubmit(async (values) => {
    if (!token) return;
    setSubmitError(false);

    try {
      await submitInvitationResponse({
        ...values,
        name: values.name.trim(),
        responseKey,
        token,
      });
      setScreenState('success');
    } catch {
      setSubmitError(true);
    }
  });

  const addAnotherGroup = () => {
    reset({ adultsCount: 1, childrenCount: 0, name: '', status: 'accepted' });
    setResponseKey(createResponseKey());
    setSubmitError(false);
    setScreenState('form');
  };

  const changeCount = (
    field: 'adultsCount' | 'childrenCount',
    delta: number,
  ) => {
    const current = getValues(field);
    const total = getValues('adultsCount') + getValues('childrenCount');
    const next = Math.max(0, Math.min(20, current + delta));

    if (delta > 0 && total >= 20) return;
    setValue(field, next, { shouldValidate: true });
  };

  if (loading) {
    return (
      <ScreenFrame styles={styles} theme={theme}>
        <View style={styles.centeredState}>
          <ActivityIndicator color={theme.colors.background.accent} size="large" />
          <Text style={styles.stateMessage}>{copy.loading}</Text>
        </View>
      </ScreenFrame>
    );
  }

  if (unavailable || !invitation) {
    return (
      <ScreenFrame styles={styles} theme={theme}>
        <View style={styles.centeredState}>
          <View style={styles.warningIcon}>
            <AntDesign
              color={theme.colors.status.warningForeground}
              name="exclamation"
              size={36}
            />
          </View>
          <Text style={styles.stateTitle}>{copy.missingTitle}</Text>
          <Text style={styles.stateMessage}>{copy.missingMessage}</Text>
          <View style={styles.warningCard}>
            <Text style={styles.warningTitle}>{copy.unavailableHintTitle}</Text>
            <Text style={styles.warningBody}>{copy.unavailableHintMessage}</Text>
          </View>
        </View>
      </ScreenFrame>
    );
  }

  const locale = language === 'uk' ? 'uk-UA' : 'en-US';
  const eventDate = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'long',
    timeZone: invitation.timeZone,
    year: 'numeric',
  }).format(new Date(invitation.startsAt));
  const organizer = invitation.organizerName ?? copy.eventFallback;

  if (screenState === 'landing') {
    return (
      <ScreenFrame styles={styles} theme={theme}>
        <View style={styles.content}>
          <Text style={styles.brand}>{copy.brand}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{copy.badge}</Text>
          </View>
          <Text style={styles.heroTitle}>{invitation.eventName}</Text>
          <Text style={styles.invitedBy}>
            {interpolate(copy.invitedBy, { name: organizer })}
          </Text>
          <View style={styles.eventCard}>
            <Text style={styles.eventDate}>{eventDate}</Text>
            {invitation.location ? (
              <View style={styles.locationRow}>
                <AntDesign
                  color={theme.colors.text.secondary}
                  name="environment"
                  size={16}
                />
                <Text style={styles.location}>{invitation.location}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>{copy.browserNoteTitle}</Text>
            <Text style={styles.infoBody}>{copy.browserNoteBody}</Text>
          </View>
          <AppButton label={copy.respond} onPress={() => setScreenState('form')} />
          <Text style={styles.privacy}>{copy.privacy}</Text>
        </View>
      </ScreenFrame>
    );
  }

  if (screenState === 'success') {
    const values = getValues();
    return (
      <ScreenFrame styles={styles} theme={theme}>
        <View style={[styles.content, styles.successContent]}>
          <View style={styles.successIcon}>
            <AntDesign
              color={theme.colors.status.successForeground}
              name="check"
              size={44}
            />
          </View>
          <Text style={styles.stateTitle}>{copy.successTitle}</Text>
          <Text style={styles.stateMessage}>{copy.successMessage}</Text>
          <View style={styles.responseCard}>
            <Text style={styles.responseName}>{values.name}</Text>
            <Text style={styles.responsePeople}>
              {interpolate(copy.responseSummary, {
                adults: values.adultsCount,
                children: values.childrenCount,
                name: values.name,
              })}
            </Text>
            <View style={styles.responseStatus}>
              <AntDesign
                color={theme.colors.status.successForeground}
                name="check"
                size={14}
              />
              <Text style={styles.responseStatusText}>
                {statusLabel(copy, values.status)}
              </Text>
            </View>
          </View>
          <AppButton label={copy.addGroup} onPress={addAnotherGroup} variant="secondary" />
          <AppButton
            label={copy.done}
            onPress={() => setScreenState('landing')}
            variant="social"
          />
        </View>
      </ScreenFrame>
    );
  }

  return (
    <ScreenFrame styles={styles} theme={theme}>
      <View style={styles.content}>
        <Text style={styles.brand}>{copy.brand}</Text>
        <Text style={styles.formEyebrow}>{copy.formEyebrow}</Text>
        <Text style={styles.formTitle}>{invitation.eventName}</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onBlur, onChange, value } }) => (
            <AppInput
              autoCapitalize="words"
              error={errors.name?.message}
              label={copy.nameLabel}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={copy.namePlaceholder}
              value={value}
            />
          )}
        />
        <Text style={styles.sectionTitle}>{copy.peopleQuestion}</Text>
        <View style={styles.counterCard}>
          <Counter
            label={copy.adults}
            onDecrement={() => changeCount('adultsCount', -1)}
            onIncrement={() => changeCount('adultsCount', 1)}
            styles={styles}
            value={adultsCount}
          />
          <Counter
            label={copy.children}
            onDecrement={() => changeCount('childrenCount', -1)}
            onIncrement={() => changeCount('childrenCount', 1)}
            styles={styles}
            value={childrenCount}
          />
        </View>
        {adultsCount + childrenCount < 1 ? (
          <Text style={styles.validationError}>{copy.validationPartySize}</Text>
        ) : null}
        <Text style={styles.sectionTitle}>{copy.attendanceQuestion}</Text>
        <View style={styles.statusOptions}>
          {(['accepted', 'maybe', 'declined'] as const).map((option) => {
            const selected = status === option;
            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                key={option}
                onPress={() => setValue('status', option)}
                style={[styles.statusOption, selected && styles.statusOptionSelected]}>
                <Text
                  style={[
                    styles.statusOptionText,
                    selected && styles.statusOptionTextSelected,
                  ]}>
                  {statusLabel(copy, option)}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>
            {interpolate(copy.responseSummary, {
              adults: adultsCount,
              children: childrenCount,
              name: name || '—',
            })}
          </Text>
        </View>
        {submitError ? <Text style={styles.submitError}>{copy.submitError}</Text> : null}
        <AppButton
          disabled={adultsCount + childrenCount < 1}
          label={isSubmitting ? copy.submitting : copy.submit}
          loading={isSubmitting}
          onPress={() => void submit()}
        />
        <Text style={styles.privacy}>{copy.privacy}</Text>
      </View>
    </ScreenFrame>
  );
}

type ScreenFrameProps = {
  children: React.ReactNode;
  styles: ReturnType<typeof createInvitationStyles>;
  theme: ReturnType<typeof useAppTheme>;
};

function ScreenFrame({ children, styles, theme }: ScreenFrameProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style={theme.statusBar} />
      <View style={styles.page}>{children}</View>
    </SafeAreaView>
  );
}

type CounterProps = {
  label: string;
  onDecrement: () => void;
  onIncrement: () => void;
  styles: ReturnType<typeof createInvitationStyles>;
  value: number;
};

function Counter({ label, onDecrement, onIncrement, styles, value }: CounterProps) {
  return (
    <View style={styles.counter}>
      <Text style={styles.counterLabel}>{label}</Text>
      <View style={styles.counterControls}>
        <Pressable onPress={onDecrement} style={styles.counterButton}>
          <Text style={styles.counterButtonText}>−</Text>
        </Pressable>
        <Text style={styles.counterValue}>{value}</Text>
        <Pressable onPress={onIncrement} style={styles.counterButton}>
          <Text style={styles.counterButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function statusLabel(
  copy: ReturnType<typeof useAppLocalization>['translations']['invitation'],
  status: RsvpStatus,
) {
  if (status === 'accepted') return copy.accepted;
  if (status === 'maybe') return copy.maybe;
  return copy.declined;
}

function interpolate(template: string, values: Record<string, number | string>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    template,
  );
}
