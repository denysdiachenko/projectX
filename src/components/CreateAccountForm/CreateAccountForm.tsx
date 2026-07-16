import { AntDesign } from '@react-native-vector-icons/ant-design';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import AppButton from '@/components/AppButton/AppButton';
import AppInput from '@/components/AppInput/AppInput';
import SocialAuthButtons from '@/components/SocialAuthButtons/SocialAuthButtons';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { isEmailSignUpError } from '@/services/auth';
import { showToast } from '@/services/toast';
import {
  createAccountSchema,
  type CreateAccountFormValues,
} from '@/validation-schemas/create-account-schema';

import createStyles from './styles';

type CreateAccountFormProps = {
  onSubmit: (values: CreateAccountFormValues) => Promise<void>;
  onLogin: () => void;
};

export default function CreateAccountForm({
  onSubmit,
  onLogin,
}: CreateAccountFormProps) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.createAccount;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const validationSchema = useMemo(
    () => createAccountSchema(copy.validation),
    [copy.validation],
  );
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountFormValues>({
    defaultValues: { displayName: '', email: '', password: '' },
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
  });
  const submitAccount = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      const errorCode = isEmailSignUpError(error) ? error.code : 'unknown';

      showToast({
        message: copy.errors[errorCode],
        title: copy.errorTitle,
        type: 'error',
      });
    }
  });

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="displayName"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            autoCapitalize="words"
            autoComplete="name"
            editable={!isSubmitting}
            error={errors.displayName?.message}
            label={copy.nameLabel}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder={copy.namePlaceholder}
            returnKeyType="next"
            textContentType="name"
            value={value}
          />
        )}
      />

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
            placeholder={copy.emailPlaceholder}
            returnKeyType="next"
            textContentType="emailAddress"
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            actionIcon={
              <AntDesign
                name={passwordVisible ? 'eye-invisible' : 'eye'}
                color={theme.colors.text.secondary}
                size={22}
              />
            }
            actionLabel={passwordVisible ? copy.hidePassword : copy.showPassword}
            autoCapitalize="none"
            autoComplete="new-password"
            autoCorrect={false}
            editable={!isSubmitting}
            error={errors.password?.message}
            label={copy.passwordLabel}
            onActionPress={() => setPasswordVisible((visible) => !visible)}
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={submitAccount}
            placeholder={copy.passwordPlaceholder}
            returnKeyType="done"
            secureTextEntry={!passwordVisible}
            textContentType="newPassword"
            value={value}
          />
        )}
      />

      <AppButton
        disabled={isSubmitting}
        label={isSubmitting ? copy.submitting : copy.submit}
        loading={isSubmitting}
        onPress={submitAccount}
        style={styles.submitButton}
        variant="primary"
      />

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerLabel}>{copy.or}</Text>
        <View style={styles.dividerLine} />
      </View>

      <SocialAuthButtons
        disabled={isSubmitting}
      />

      <View style={styles.loginRow}>
        <Text style={styles.loginPrompt}>{copy.existingAccount}</Text>
        <Pressable
          accessibilityRole="button"
          hitSlop={theme.spacing.x2}
          onPress={onLogin}>
          <Text style={styles.loginLink}>{copy.login}</Text>
        </Pressable>
      </View>

      <Text style={styles.legal}>{copy.legal}</Text>
    </View>
  );
}
