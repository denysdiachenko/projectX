import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import AppButton from '@/components/AppButton/AppButton';
import AppInput from '@/components/AppInput/AppInput';
import { useAppLocalization } from '@/hooks/app-localization';
import {
  isAccountPasswordError,
  requestPasswordReset,
} from '@/services/auth';
import { showToast } from '@/services/toast';
import {
  createForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/validation-schemas/forgot-password-schema';

import { createAuthFlowScreenStyles } from './styles';
import { useAppTheme } from '@/hooks/app-theme';

type ForgotPasswordFormProps = {
  onSent: (email: string) => void;
};

export default function ForgotPasswordForm({
  onSent,
}: ForgotPasswordFormProps) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.forgotPassword;
  const styles = useMemo(() => createAuthFlowScreenStyles(theme), [theme]);
  const schema = useMemo(
    () => createForgotPasswordSchema(copy.validation),
    [copy.validation],
  );
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: '' },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });
  const submit = handleSubmit(async ({ email }) => {
    try {
      await requestPasswordReset(email);
      onSent(email.trim());
    } catch (error) {
      const errorCode = isAccountPasswordError(error) ? error.code : 'unknown';
      const message = errorCode === 'invalidEmail'
        || errorCode === 'network'
        || errorCode === 'rateLimited'
        ? copy.errors[errorCode]
        : copy.errors.unknown;

      showToast({ message, title: copy.errorTitle, type: 'error' });
    }
  });

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            editable={!isSubmitting}
            error={errors.email?.message}
            keyboardType="email-address"
            label={copy.emailLabel}
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={submit}
            placeholder={copy.emailPlaceholder}
            returnKeyType="done"
            textContentType="emailAddress"
            value={value}
          />
        )}
      />
      <AppButton
        disabled={isSubmitting}
        label={isSubmitting ? copy.submitting : copy.submit}
        loading={isSubmitting}
        onPress={submit}
      />
    </View>
  );
}
