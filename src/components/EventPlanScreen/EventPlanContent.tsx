import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import { EVENT_TAB_BAR_HEIGHT } from '@/constants/event-tabs';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { getEventPlan, type EventPlanDetails } from '@/services/event-plan';

import {
  DRINK_TARGET_CATEGORIES,
  FOOD_TARGET_CATEGORIES,
  SUPPLY_TARGET_CATEGORIES,
} from './constants';
import PlanTargetGroup from './PlanTargetGroup';
import { createEventPlanStyles } from './styles';

type EventPlanContentProps = {
  eventId: string;
};

export default function EventPlanContent({ eventId }: EventPlanContentProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { language, translations } = useAppLocalization();
  const styles = useMemo(
    () => createEventPlanStyles(theme, EVENT_TAB_BAR_HEIGHT + insets.bottom),
    [insets.bottom, theme],
  );
  const [plan, setPlan] = useState<EventPlanDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const copy = translations.eventPlan;

  const loadPlan = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      setPlan(await getEventPlan(eventId));
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useFocusEffect(useCallback(() => {
    let isActive = true;

    void getEventPlan(eventId)
      .then((nextPlan) => {
        if (isActive) {
          setPlan(nextPlan);
          setHasError(false);
        }
      })
      .catch(() => {
        if (isActive) setHasError(true);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [eventId]));

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.state]}>
        <StatusBar barStyle={theme.statusBar === 'dark' ? 'dark-content' : 'light-content'} />
        <ActivityIndicator color={theme.colors.background.brand} size="large" />
      </View>
    );
  }

  if (hasError || !plan) {
    return (
      <View style={[styles.screen, styles.state]}>
        <Text style={styles.errorText}>{copy.loadError}</Text>
        <AppButton
          label={copy.retry}
          onPress={() => void loadPlan()}
          style={styles.retryButton}
        />
      </View>
    );
  }

  const locale = language === 'uk' ? 'uk-UA' : 'en-US';
  const meta = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: plan.timeZone,
  }).format(new Date(plan.startsAt));
  const context = interpolate(copy.context, {
    adults: plan.adultsCount,
    children: plan.childrenCount,
    duration: plan.durationHours,
    season: plan.season ? (copy.seasons[plan.season] ?? plan.season) : '—',
    location: copy.locations[plan.location] ?? plan.location,
  });
  const foodTargets = plan.targets.filter((target) => FOOD_TARGET_CATEGORIES.has(target.category));
  const drinkTargets = plan.targets.filter((target) => DRINK_TARGET_CATEGORIES.has(target.category));
  const supplyTargets = plan.targets.filter((target) => SUPPLY_TARGET_CATEGORIES.has(target.category));

  return (
    <View style={styles.screen}>
      <StatusBar barStyle={theme.statusBar === 'dark' ? 'dark-content' : 'light-content'} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{plan.name}</Text>
        <Text style={styles.meta}>{meta}</Text>

        <View style={styles.readyCard}>
          <View style={styles.readyIcon}>
            <AntDesign name="check" color={theme.colors.status.successForeground} size={24} />
          </View>
          <View style={styles.readyCopy}>
            <Text style={styles.readyTitle}>{copy.readyTitle}</Text>
            <Text style={styles.readyMessage}>
              {interpolate(copy.readyMessage, { version: plan.rulesVersion })}
            </Text>
          </View>
        </View>

        <View style={styles.contextCard}>
          <AntDesign name="info-circle" color={theme.colors.status.infoForeground} size={18} />
          <Text style={styles.contextText}>{context}</Text>
        </View>

        <PlanTargetGroup targets={foodTargets} title={copy.sections.food} units={plan.units} />
        <PlanTargetGroup targets={drinkTargets} title={copy.sections.drinks} units={plan.units} />
        <PlanTargetGroup targets={supplyTargets} title={copy.sections.supplies} units={plan.units} />

        <View style={styles.productsNote}>
          <AntDesign name="edit" color={theme.colors.background.accent} size={20} />
          <View style={styles.productsNoteCopy}>
            <Text style={styles.productsNoteTitle}>{copy.productsNoteTitle}</Text>
            <Text style={styles.productsNoteBody}>{copy.productsNoteBody}</Text>
          </View>
        </View>
      </ScrollView>

    </View>
  );
}

function interpolate(template: string, values: Record<string, number | string>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    template,
  );
}
