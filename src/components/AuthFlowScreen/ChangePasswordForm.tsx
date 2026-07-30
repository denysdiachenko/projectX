import { AntDesign } from '@react-native-vector-icons/ant-design';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import AppButton from '@/components/AppButton/AppButton';
import AppInput from '@/components/AppInput/AppInput';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import {
  isAccountPasswordError,
  updateAccountPassword,
} from '@/services/auth';
import { showToast } from '@/services/toast';
import {
  createChangePasswordSchema,
  type ChangePasswordFormValues,
} from '@/validation-schemas/change-password-schema';

import { createAuthFlowScreenStyles } from './styles';

type ChangePasswordFormProps = {
  onSaved: () => void;
  requireCurrentPassword: boolean;
};

export default function ChangePasswordForm({
  onSaved,
  requireCurrentPassword,
}: ChangePasswordFormProps) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.changePassword;
  const styles = useMemo(() => createAuthFlowScreenStyles(theme), [theme]);
  const schema = useMemo(
    () => createChangePasswordSchema(copy.validation, requireCurrentPassword),
    [copy.validation, requireCurrentPassword],
  );
  const [visibleField, setVisibleField] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      confirmPassword: '',
      currentPassword: '',
      password: '',
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });
  const submit = handleSubmit(async ({ currentPassword, password }) => {
    try {
      await updateAccountPassword({
        currentPassword: requireCurrentPassword ? currentPassword : undefined,
        password,
      });
      showToast({
        message: copy.successMessage,
        title: copy.successTitle,
        type: 'success',
      });
      onSaved();
    } catch (error) {
      const errorCode = isAccountPasswordError(error) ? error.code : 'unknown';
      const message = errorCode === 'invalidEmail'
        ? copy.errors.unknown
        : copy.errors[errorCode];

      showToast({ message, title: copy.errorTitle, type: 'error' });
    }
  });
  const passwordInput = (
    name: 'confirmPassword' | 'currentPassword' | 'password',
    label: string,
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onBlur, onChange, value } }) => (
        <AppInput
          actionIcon={
            <AntDesign
              color={theme.colors.text.secondary}
              name={visibleField === name ? 'eye-invisible' : 'eye'}
              size={22}
            />
          }
          actionLabel={visibleField === name ? copy.hidePassword : copy.showPassword}
          autoCapitalize="none"
          autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'}
          autoCorrect={false}
          editable={!isSubmitting}
          error={errors[name]?.message}
          label={label}
          onActionPress={() => setVisibleField((field) => field === name ? null : name)}
          onBlur={onBlur}
          onChangeText={onChange}
          onSubmitEditing={name === 'confirmPassword' ? submit : undefined}
          placeholder={copy.passwordPlaceholder}
          returnKeyType={name === 'confirmPassword' ? 'done' : 'next'}
          secureTextEntry={visibleField !== name}
          textContentType={name === 'currentPassword' ? 'password' : 'newPassword'}
          value={value}
        />
      )}
    />
  );

  return (
    <View style={styles.form}>
      {requireCurrentPassword
        ? passwordInput('currentPassword', copy.currentPasswordLabel)
        : null}
      {passwordInput('password', copy.passwordLabel)}
      {passwordInput('confirmPassword', copy.confirmPasswordLabel)}
      <AppButton
        disabled={isSubmitting}
        label={isSubmitting ? copy.submitting : copy.submit}
        loading={isSubmitting}
        onPress={submit}
      />
    </View>
  );
}
