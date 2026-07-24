import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { ActivityIndicator, Animated, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import CalendarOutlined from '@/components/Icons/CalendarOutlined';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import { createEventManagementStyles } from './styles';
import { useBottomSheetAnimation } from './useBottomSheetAnimation';

type EventActionsSheetProps = {
  addingToCalendar: boolean;
  deleting: boolean;
  loadingRulesVersion: boolean;
  onClose: () => void;
  onDismiss: () => void;
  onAddToCalendar: () => void;
  onConfirmDelete: () => void;
  onDelete: () => void;
  onEdit: () => void;
  rulesVersion: string | null;
  showDeleteConfirmation: boolean;
  visible: boolean;
};

export default function EventActionsSheet({
  addingToCalendar,
  deleting,
  loadingRulesVersion,
  onClose,
  onDismiss,
  onAddToCalendar,
  onConfirmDelete,
  onDelete,
  onEdit,
  rulesVersion,
  showDeleteConfirmation,
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
    if (!addingToCalendar && !deleting) onClose();
  };

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
            disabled={addingToCalendar || deleting}
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
                disabled={addingToCalendar}
                onPress={onEdit}
                style={({ pressed }) => [
                  styles.action,
                  addingToCalendar && styles.actionDisabled,
                  pressed && styles.actionPressed,
                ]}>
                <AntDesign color={theme.colors.text.primary} name="edit" size={22} />
                <Text style={styles.actionLabel}>{copy.editAction}</Text>
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
