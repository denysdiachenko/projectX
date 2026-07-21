import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import { CREATE_EVENT_TOTAL_STEPS } from '@/constants/create-event';
import { ROUTES } from '@/constants/routes';
import { isValidEventTime } from '@/helpers/eventDateTime';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { createEventPlan, updateEventPlan } from '@/services/event-plan';
import { showToast } from '@/services/toast';

import CreateEventHeaderAction from './CreateEventHeaderAction';
import CreateEventProgress from './CreateEventProgress';
import EventDateSheet from './EventDateSheet';
import ExitCreateEventSheet from './ExitCreateEventSheet';
import { createCreateEventStyles } from './styles';
import EventDetailsStep from './steps/EventDetailsStep';
import EventTypeStep from './steps/EventTypeStep';
import GuestsStep from './steps/GuestsStep';
import MenuStep from './steps/MenuStep';
import ReviewStep from './steps/ReviewStep';
import type { CreateEventDraft, CreateEventStep, UpdateCreateEventDraft } from './types';

type EventFormScreenProps = {
  eventId?: string;
  initialDraft: CreateEventDraft;
  mode: 'create' | 'edit';
};

export default function EventFormScreen({ eventId, initialDraft, mode }: EventFormScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.createEvent;
  const managementCopy = translations.eventManagement;
  const styles = useMemo(
    () => createCreateEventStyles(theme, insets.bottom),
    [insets.bottom, theme],
  );
  const [step, setStep] = useState<CreateEventStep>(0);
  const [draft, setDraft] = useState<CreateEventDraft>(initialDraft);
  const [error, setError] = useState<string>();
  const [exitVisible, setExitVisible] = useState(false);
  const [dateVisible, setDateVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = mode === 'edit';

  const updateDraft: UpdateCreateEventDraft = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setError(undefined);
  };

  const goBack = () => {
    if (isSubmitting) return;
    if (step === 0) {
      router.back();
      return;
    }

    setError(undefined);
    setStep((step - 1) as CreateEventStep);
  };

  const validateStep = () => {
    if (step === 1 && draft.adults + draft.children === 0) {
      setError(copy.validation.guests);
      return false;
    }
    if (step === 2 && !draft.name.trim()) {
      setError(copy.validation.eventName);
      return false;
    }
    if (step === 2 && !isValidEventTime(draft.time)) {
      setError(copy.validation.eventTime);
      return false;
    }

    const customDuration = Number(draft.customDuration);
    if (
      step === 2
      && draft.duration === 'custom'
      && (!Number.isInteger(customDuration) || customDuration < 1 || customDuration > 24)
    ) {
      setError(copy.validation.customDuration);
      return false;
    }

    return true;
  };

  const goNext = () => {
    if (!validateStep()) return;
    if (step < CREATE_EVENT_TOTAL_STEPS - 1) {
      setStep((step + 1) as CreateEventStep);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <EventTypeStep
            value={draft.eventType}
            onChange={(value) => updateDraft('eventType', value)}
          />
        );
      case 1:
        return <GuestsStep draft={draft} error={error} onUpdate={updateDraft} />;
      case 2:
        return (
          <EventDetailsStep
            draft={draft}
            error={error}
            onOpenDate={() => setDateVisible(true)}
            onUpdate={updateDraft}
          />
        );
      case 3:
        return <MenuStep draft={draft} onUpdate={updateDraft} />;
      case 4:
        return <ReviewStep draft={draft} onEdit={setStep} onUpdate={updateDraft} />;
    }
  };

  const submit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (isEditing) {
        if (!eventId) {
          throw new Error('eventId is required in edit mode');
        }

        await updateEventPlan(eventId, draft);
        showToast({
          message: managementCopy.updateSuccessMessage,
          title: managementCopy.updateSuccessTitle,
          type: 'success',
        });
        router.back();
      } else {
        const { eventId: createdEventId } = await createEventPlan(draft);
        showToast({
          message: copy.planSuccessMessage,
          title: copy.planSuccessTitle,
          type: 'success',
        });
        router.replace(ROUTES.eventPlan(createdEventId));
      }
    } catch {
      showToast({
        message: isEditing ? managementCopy.updateErrorMessage : copy.planErrorMessage,
        title: isEditing ? managementCopy.updateErrorTitle : copy.planErrorTitle,
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  let finalLabel = copy.createPlan;
  if (isEditing) {
    finalLabel = isSubmitting ? managementCopy.savingChanges : managementCopy.saveChanges;
  } else if (isSubmitting) {
    finalLabel = copy.creatingPlan;
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          gestureEnabled: false,
          headerBackVisible: false,
          headerLeft: () => (
            <CreateEventHeaderAction
              accessibilityLabel={copy.back}
              icon="left"
              onPress={goBack}
            />
          ),
          headerRight: () => (
            <CreateEventHeaderAction
              accessibilityLabel={copy.close}
              icon="close"
              onPress={() => {
                if (!isSubmitting) setExitVisible(true);
              }}
            />
          ),
          headerShadowVisible: false,
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.background.surface },
          headerTitle: isEditing ? managementCopy.editTitle : copy.headerTitle,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: theme.colors.text.primary,
            fontFamily: theme.fontFamily.semiBold,
            fontSize: theme.typography.titleMedium.fontSize,
          },
        }}
      />
      <StatusBar style={theme.statusBar} />
      <CreateEventProgress step={step} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={56}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={[styles.content, step >= 2 && styles.contentCompact]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {renderStep()}
        </ScrollView>
        <View style={styles.footer}>
          <AppButton
            label={step === 4 ? finalLabel : copy.next}
            loading={step === 4 && isSubmitting}
            onPress={step === 4 ? () => void submit() : goNext}
          />
        </View>
      </KeyboardAvoidingView>
      <ExitCreateEventSheet
        copy={isEditing ? managementCopy.exit : undefined}
        visible={exitVisible}
        onCancel={() => setExitVisible(false)}
        onConfirm={() => {
          setExitVisible(false);
          router.back();
        }}
      />
      <EventDateSheet
        value={draft.date}
        visible={dateVisible}
        onChange={(value) => updateDraft('date', value)}
        onClose={() => setDateVisible(false)}
      />
    </View>
  );
}
