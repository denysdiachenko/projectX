import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import AppInput from '@/components/AppInput/AppInput';
import AppSelect from '@/components/AppSelect/AppSelect';
import { useBottomSheetAnimation } from '@/components/EventManagement/useBottomSheetAnimation';
import { parseShoppingNumber } from '@/helpers/shoppingQuantity';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import type { SupportedLanguage } from '@/localization/types';
import {
  getAvailableMeasurementUnits,
  getMeasurementUnitLabel,
  type MeasurementUnit,
} from '@/services/measurement-units';
import type { ShoppingItem, ShoppingItemValues, ShoppingTarget } from '@/services/shopping-list';
import {
  createShoppingItemSchema,
  type ShoppingItemFormValues,
} from '@/validation-schemas/shopping-item-schema';

import { createShoppingListStyles } from './styles';

type ShoppingItemSheetProps = {
  categoryLabel: string;
  item: ShoppingItem | null;
  language: SupportedLanguage;
  target: ShoppingTarget | null;
  units: MeasurementUnit[];
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: ShoppingItemValues) => Promise<void>;
};

export default function ShoppingItemSheet({
  categoryLabel,
  item,
  language,
  target,
  units,
  visible,
  onClose,
  onSubmit,
}: ShoppingItemSheetProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { translations } = useAppLocalization();
  const copy = translations.shopping;
  const styles = useMemo(
    () => createShoppingListStyles(theme, insets.bottom),
    [insets.bottom, theme],
  );
  const schema = useMemo(() => createShoppingItemSchema(copy.validation), [copy.validation]);
  const { backdropOpacity, sheetTranslateY } = useBottomSheetAnimation(visible);
  const unitOptions = useMemo(
    () => getAvailableMeasurementUnits(units, item?.unit),
    [item?.unit, units],
  );
  const fallbackUnit = item?.unit ?? target?.unit ?? unitOptions[0]?.code ?? '';
  const unitSelectOptions = useMemo(
    () => unitOptions.map((unit) => ({
      label: getMeasurementUnitLabel(unit.code, units, language),
      value: unit.code,
    })),
    [language, unitOptions, units],
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ShoppingItemFormValues>({
    defaultValues: getDefaultValues(item, fallbackUnit),
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (visible) reset(getDefaultValues(item, fallbackUnit));
  }, [fallbackUnit, item, reset, visible]);

  const submit = handleSubmit(async (values) => {
    await onSubmit({
      name: values.name,
      packageCount: values.packageCount ? Number(values.packageCount) : null,
      packageSize: values.packageSize ? parseShoppingNumber(values.packageSize) : null,
      quantity: parseShoppingNumber(values.quantity),
      unit: values.unit,
    });
  });
  const close = () => {
    if (!isSubmitting) onClose();
  };

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
            <ScrollView
              contentContainerStyle={styles.formScroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <Text style={styles.formTitle}>{item ? copy.form.editTitle : copy.form.addTitle}</Text>
              <Text style={styles.categoryLabel}>{categoryLabel}</Text>

              <View style={styles.formFields}>
                <Controller
                  control={control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <AppInput
                      autoCapitalize="sentences"
                      error={fieldState.error?.message}
                      label={copy.form.name}
                      maxLength={120}
                      onBlur={field.onBlur}
                      onChangeText={field.onChange}
                      placeholder={copy.form.namePlaceholder}
                      returnKeyType="next"
                      value={field.value}
                    />
                  )}
                />
                <View style={styles.quantityRow}>
                  <View style={styles.quantityField}>
                    <Controller
                      control={control}
                      name="quantity"
                      render={({ field, fieldState }) => (
                        <AppInput
                          error={fieldState.error?.message}
                          keyboardType="decimal-pad"
                          label={copy.form.quantity}
                          onBlur={field.onBlur}
                          onChangeText={field.onChange}
                          value={field.value}
                        />
                      )}
                    />
                  </View>
                  <View style={styles.quantityField}>
                    <Controller
                      control={control}
                      name="unit"
                      render={({ field, fieldState }) => (
                        <AppSelect
                          error={fieldState.error?.message}
                          label={copy.form.unit}
                          options={unitSelectOptions}
                          value={field.value}
                          onBlur={field.onBlur}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </View>
                </View>

                <View style={styles.packageHeader}>
                  <Text style={styles.packageTitle}>{copy.form.packageTitle}</Text>
                  <Text style={styles.packageHint}>{copy.form.packageHint}</Text>
                </View>
                <View style={styles.packageFields}>
                  <View style={styles.packageField}>
                    <Controller
                      control={control}
                      name="packageSize"
                      render={({ field, fieldState }) => (
                        <AppInput
                          error={fieldState.error?.message}
                          keyboardType="decimal-pad"
                          label={copy.form.packageSize}
                          onBlur={field.onBlur}
                          onChangeText={field.onChange}
                          value={field.value}
                        />
                      )}
                    />
                  </View>
                  <View style={styles.packageField}>
                    <Controller
                      control={control}
                      name="packageCount"
                      render={({ field, fieldState }) => (
                        <AppInput
                          error={fieldState.error?.message}
                          keyboardType="number-pad"
                          label={copy.form.packageCount}
                          onBlur={field.onBlur}
                          onChangeText={field.onChange}
                          value={field.value}
                        />
                      )}
                    />
                  </View>
                </View>

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
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function getDefaultValues(
  item: ShoppingItem | null,
  fallbackUnit: string,
): ShoppingItemFormValues {
  return {
    name: item?.name ?? '',
    packageCount: item?.package_count ? String(item.package_count) : '',
    packageSize: item?.package_size ? String(item.package_size) : '',
    quantity: item?.quantity ? String(item.quantity) : '',
    unit: item?.unit ?? fallbackUnit,
  };
}
