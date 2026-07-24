import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import AppInput from '@/components/AppInput/AppInput';
import { useBottomSheetAnimation } from '@/components/EventManagement/useBottomSheetAnimation';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import type { ChecklistItem } from '@/services/checklist';
import {
  createChecklistItemSchema,
  type ChecklistItemFormValues,
} from '@/validation-schemas/checklist-item-schema';

import { createChecklistStyles } from './styles';

type ChecklistTaskSheetProps = {
  item: ChecklistItem | null;
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string) => Promise<void>;
};

export default function ChecklistTaskSheet({
  item,
  visible,
  onClose,
  onSubmit,
}: ChecklistTaskSheetProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { translations } = useAppLocalization();
  const copy = translations.checklist;
  const styles = useMemo(
    () => createChecklistStyles(theme, insets.bottom),
    [insets.bottom, theme],
  );
  const schema = useMemo(() => createChecklistItemSchema(copy.validation), [copy.validation]);
  const { backdropOpacity, sheetTranslateY } = useBottomSheetAnimation(visible);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ChecklistItemFormValues>({
    defaultValues: { title: item?.custom_title ?? '' },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (visible) reset({ title: item?.custom_title ?? '' });
  }, [item, reset, visible]);

  const close = () => {
    if (!isSubmitting) onClose();
  };
  const submit = handleSubmit(async ({ title }) => {
    await onSubmit(title);
  });

  return (
    <Modal
      animationType="none"
      onRequestClose={close}
      statusBarTranslucent
      transparent
      visible={visible}>
      <View style={styles.modalRoot}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable
            accessibilityLabel={copy.form.cancel}
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={close}
            style={styles.backdropPressable}
          />
        </Animated.View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>
          <Animated.View
            accessibilityViewIsModal
            style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}>
            <View style={styles.handle} />
            <View style={styles.formContent}>
              <Text style={styles.formTitle}>
                {item ? copy.form.editTitle : copy.form.addTitle}
              </Text>
              <Controller
                control={control}
                name="title"
                render={({ field, fieldState }) => (
                  <AppInput
                    autoCapitalize="sentences"
                    autoFocus
                    error={fieldState.error?.message}
                    label={copy.form.title}
                    maxLength={200}
                    onBlur={field.onBlur}
                    onChangeText={field.onChange}
                    placeholder={copy.form.placeholder}
                    returnKeyType="done"
                    value={field.value}
                    onSubmitEditing={() => void submit()}
                  />
                )}
              />
              <View style={styles.formActions}>
                <AppButton
                  label={isSubmitting ? copy.form.saving : copy.form.save}
                  loading={isSubmitting}
                  onPress={() => void submit()}
                />
                <AppButton
                  disabled={isSubmitting}
                  label={copy.form.cancel}
                  onPress={close}
                  variant="secondary"
                />
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
