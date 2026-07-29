import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { ActivityIndicator, Animated, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import CalendarOutlined from '@/components/Icons/CalendarOutlined';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import type {
  BudgetOutcome,
  EventCompletionDetails,
} from '@/services/event-plan';

import { createEventManagementStyles } from './styles';
import { useBottomSheetAnimation } from './useBottomSheetAnimation';

type EventActionsSheetProps = {
  addingToCalendar: boolean;
  budgetOutcome: BudgetOutcome | null;
  completionDetails: EventCompletionDetails | null;
  completing: boolean;
  deleting: boolean;
  loadingRulesVersion: boolean;
  onClose: () => void;
  onDismiss: () => void;
  onAddToCalendar: () => void;
  onConfirmDelete: () => void;
  onComplete: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onOpenCompletion: () => void;
  onReopen: () => void;
  onSelectBudgetOutcome: (outcome: BudgetOutcome) => void;
  reopening: boolean;
  rulesVersion: string | null;
  showDeleteConfirmation: boolean;
  showCompletionForm: boolean;
  visible: boolean;
};

export default function EventActionsSheet({
  addingToCalendar,
  budgetOutcome,
  completionDetails,
  completing,
  deleting,
  loadingRulesVersion,
  onClose,
  onDismiss,
  onAddToCalendar,
  onConfirmDelete,
  onComplete,
  onDelete,
  onEdit,
  onOpenCompletion,
  onReopen,
  onSelectBudgetOutcome,
  reopening,
  rulesVersion,
  showDeleteConfirmation,
  showCompletionForm,
  visible,
}: EventActionsSheetProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { translations } = useAppLocalization();
  const copy = translations.eventManagement;
  const styles = useMemo(
    () => createEventManagementStyles(theme, insets.bottom),
    [insets.bottom, theme],
  );
  const { backdropOpacity, sheetTranslateY } = useBottomSheetAnimation(visible);

  const close = () => {
    if (!addingToCalendar && !completing && !deleting && !reopening) onClose();
  };
  const isCompleted = completionDetails?.status === 'completed';
  const hasBudget = completionDetails?.budgetAmount != null;
  const unfinishedItems = completionDetails
    ? interpolate(copy.incompleteItemsWarning, {
      shopping: completionDetails.unfinishedShoppingItems,
      tasks: completionDetails.unfinishedChecklistItems,
    })
    : null;

  return (
    <Modal
      animationType="none"
      onDismiss={onDismiss}
      onRequestClose={close}
      statusBarTranslucent
      transparent
      visible={visible}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable
            disabled={addingToCalendar || completing || deleting || reopening}
            onPress={close}
            style={styles.backdropPressable}
          />
        </Animated.View>
        <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}>
          <View style={styles.handle} />
          {showDeleteConfirmation ? (
            <>
              <Text style={styles.centeredTitle}>{copy.deleteConfirmTitle}</Text>
              <Text style={styles.body}>{copy.deleteConfirmMessage}</Text>
              <View style={styles.actions}>
                <AppButton
                  disabled={deleting}
                  label={deleting ? copy.deleting : copy.deleteAction}
                  loading={deleting}
                  onPress={onConfirmDelete}
                  variant="destructive"
                />
                <AppButton disabled={deleting} label={copy.cancel} onPress={close} variant="secondary" />
              </View>
            </>
          ) : showCompletionForm ? (
            <>
              <Text style={styles.centeredTitle}>{copy.completeTitle}</Text>
              <Text style={styles.body}>{copy.completeMessage}</Text>
              {completionDetails
                && (
                  completionDetails.unfinishedChecklistItems > 0
                  || completionDetails.unfinishedShoppingItems > 0
                ) ? (
                  <View style={styles.warning}>
                    <AntDesign
                      color={theme.colors.status.warningForeground}
                      name="exclamation-circle"
                      size={20}
                    />
                    <Text style={styles.warningText}>{unfinishedItems}</Text>
                  </View>
                ) : null}
              {hasBudget ? (
                <View style={styles.budgetBlock}>
                  <Text style={styles.budgetTitle}>{copy.budgetQuestion}</Text>
                  <View style={styles.budgetOptions}>
                    {([
                      ['within_budget', copy.budgetWithin],
                      ['over_budget', copy.budgetOver],
                      ['unknown', copy.budgetUnknown],
                    ] as const).map(([value, label]) => {
                      const selected = budgetOutcome === value;

                      return (
                        <Pressable
                          accessibilityRole="radio"
                          accessibilityState={{ checked: selected }}
                          key={value}
                          onPress={() => onSelectBudgetOutcome(value)}
                          style={[
                            styles.budgetOption,
                            selected && styles.budgetOptionSelected,
                          ]}>
                          <Text
                            style={[
                              styles.budgetOptionLabel,
                              selected && styles.budgetOptionLabelSelected,
                            ]}>
                            {label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ) : null}
              <View style={styles.actions}>
                <AppButton
                  disabled={completing || (hasBudget && !budgetOutcome)}
                  label={completing ? copy.completing : copy.completeAction}
                  loading={completing}
                  onPress={onComplete}
                />
                <AppButton
                  disabled={completing}
                  label={copy.cancel}
                  onPress={close}
                  variant="secondary"
                />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>{copy.actionsTitle}</Text>
              <View style={styles.versionInfo}>
                <View style={styles.versionIcon}>
                  <AntDesign
                    color={theme.colors.background.accent}
                    name="info-circle"
                    size={20}
                  />
                </View>
                <View style={styles.versionCopy}>
                  <Text style={styles.versionLabel}>{copy.generationVersionLabel}</Text>
                  {loadingRulesVersion ? (
                    <ActivityIndicator
                      color={theme.colors.background.accent}
                      size="small"
                      style={styles.versionLoader}
                    />
                  ) : (
                    <Text style={styles.versionValue}>
                      {rulesVersion ?? copy.generationVersionUnavailable}
                    </Text>
                  )}
                </View>
              </View>
              <Pressable
                disabled={addingToCalendar || isCompleted}
                onPress={onEdit}
                style={({ pressed }) => [
                  styles.action,
                  (addingToCalendar || isCompleted) && styles.actionDisabled,
                  pressed && styles.actionPressed,
                ]}>
                <AntDesign color={theme.colors.text.primary} name="edit" size={22} />
                <Text style={styles.actionLabel}>{copy.editAction}</Text>
              </Pressable>
              <View style={styles.divider} />
              <Pressable
                disabled={!completionDetails || completing || reopening}
                onPress={isCompleted ? onReopen : onOpenCompletion}
                style={({ pressed }) => [
                  styles.action,
                  (!completionDetails || completing || reopening) && styles.actionDisabled,
                  pressed && styles.actionPressed,
                ]}>
                {completing || reopening ? (
                  <ActivityIndicator color={theme.colors.text.primary} size="small" />
                ) : (
                  <AntDesign
                    color={theme.colors.text.primary}
                    name={isCompleted ? 'reload' : 'check-circle'}
                    size={22}
                  />
                )}
                <Text style={styles.actionLabel}>
                  {isCompleted ? copy.reopenAction : copy.completeAction}
                </Text>
              </Pressable>
              <View style={styles.divider} />
              <Pressable
                disabled={addingToCalendar}
                onPress={onAddToCalendar}
                style={({ pressed }) => [
                  styles.action,
                  addingToCalendar && styles.actionDisabled,
                  pressed && styles.actionPressed,
                ]}>
                {addingToCalendar ? (
                  <ActivityIndicator color={theme.colors.text.primary} size="small" />
                ) : (
                  <CalendarOutlined color={theme.colors.text.primary} />
                )}
                <Text style={styles.actionLabel}>
                  {addingToCalendar ? copy.addingToCalendar : copy.addToCalendar}
                </Text>
              </Pressable>
              <View style={styles.divider} />
              <Pressable
                disabled={addingToCalendar}
                onPress={onDelete}
                style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}>
                <AntDesign color={theme.colors.status.errorForeground} name="delete" size={22} />
                <Text style={[styles.actionLabel, styles.destructiveLabel]}>{copy.deleteAction}</Text>
              </Pressable>
              <Pressable
                disabled={addingToCalendar}
                onPress={close}
                style={({ pressed }) => [styles.cancel, pressed && styles.actionPressed]}>
                <Text style={styles.cancelLabel}>{copy.cancel}</Text>
              </Pressable>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

function interpolate(template: string, values: Record<string, number>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    template,
  );
}
