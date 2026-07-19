import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import CreateEventHeaderAction from '@/components/CreateEventScreen/CreateEventHeaderAction';
import CreateEventProgress from '@/components/CreateEventScreen/CreateEventProgress';
import EventDateSheet from '@/components/CreateEventScreen/EventDateSheet';
import ExitCreateEventSheet from '@/components/CreateEventScreen/ExitCreateEventSheet';
import { createCreateEventStyles } from '@/components/CreateEventScreen/styles';
import EventDetailsStep from '@/components/CreateEventScreen/steps/EventDetailsStep';
import EventTypeStep from '@/components/CreateEventScreen/steps/EventTypeStep';
import GuestsStep from '@/components/CreateEventScreen/steps/GuestsStep';
import MenuStep from '@/components/CreateEventScreen/steps/MenuStep';
import ReviewStep from '@/components/CreateEventScreen/steps/ReviewStep';
import type {
  CreateEventDraft,
  CreateEventStep,
  UpdateCreateEventDraft,
} from '@/components/CreateEventScreen/types';
import {
  CREATE_EVENT_TOTAL_STEPS,
  createInitialEventDraft,
} from '@/constants/create-event';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { showToast } from '@/services/toast';

export default function CreateEventScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.createEvent;
  const styles = useMemo(
    () => createCreateEventStyles(theme, insets.bottom),
    [insets.bottom, theme],
  );
  const [step, setStep] = useState<CreateEventStep>(0);
  const [draft, setDraft] = useState<CreateEventDraft>(createInitialEventDraft);
  const [error, setError] = useState<string>();
  const [exitVisible, setExitVisible] = useState(false);
  const [dateVisible, setDateVisible] = useState(false);

  const updateDraft: UpdateCreateEventDraft = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setError(undefined);
  };

  const goBack = () => {
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

  const createPlan = () => {
    showToast({
      message: copy.planPlaceholderMessage,
      title: copy.planPlaceholderTitle,
      type: 'info',
    });
  };

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
              onPress={() => setExitVisible(true)}
            />
          ),
          headerShadowVisible: false,
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.background.surface },
          headerTitle: copy.headerTitle,
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
            label={step === 4 ? copy.createPlan : copy.next}
            onPress={step === 4 ? createPlan : goNext}
          />
        </View>
      </KeyboardAvoidingView>
      <ExitCreateEventSheet
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
