import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { Animated, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import { createEventManagementStyles } from './styles';
import { useBottomSheetAnimation } from './useBottomSheetAnimation';

type EventActionsSheetProps = {
  deleting: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  onDelete: () => void;
  onEdit: () => void;
  showDeleteConfirmation: boolean;
  visible: boolean;
};

export default function EventActionsSheet({
  deleting,
  onClose,
  onConfirmDelete,
  onDelete,
  onEdit,
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
    if (!deleting) onClose();
  };

  return (
    <Modal animationType="none" onRequestClose={close} statusBarTranslucent transparent visible={visible}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable disabled={deleting} onPress={close} style={styles.backdropPressable} />
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
              <Pressable onPress={onEdit} style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}>
                <AntDesign color={theme.colors.text.primary} name="edit" size={22} />
                <Text style={styles.actionLabel}>{copy.editAction}</Text>
              </Pressable>
              <View style={styles.divider} />
              <Pressable
                onPress={onDelete}
                style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}>
                <AntDesign color={theme.colors.status.errorForeground} name="delete" size={22} />
                <Text style={[styles.actionLabel, styles.destructiveLabel]}>{copy.deleteAction}</Text>
              </Pressable>
              <Pressable onPress={close} style={({ pressed }) => [styles.cancel, pressed && styles.actionPressed]}>
                <Text style={styles.cancelLabel}>{copy.cancel}</Text>
              </Pressable>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}
