import { AntDesign } from '@react-native-vector-icons/ant-design';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import AppInput from '@/components/AppInput/AppInput';
import AppButton from '@/components/AppButton/AppButton';
import SocialAuthButtons from '@/components/SocialAuthButtons/SocialAuthButtons';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import {
  createLoginSchema,
  type LoginFormValues,
} from '@/validation-schemas/login-schema';
import {
  isEmailSignInError,
} from '@/services/auth';
import { showToast } from '@/services/toast';

import createStyles from './styles';

type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  onForgotPassword: () => void;
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
  onCreateAccount: () => void;
};

export default function LoginForm({
  onSubmit,
  onForgotPassword,
  onGoogleLogin,
  onAppleLogin,
  onCreateAccount,
}: LoginFormProps) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.login;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const loginSchema = useMemo(() => createLoginSchema(copy.validation), [copy.validation]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
    resolver: yupResolver(loginSchema),
  });
  const submitLogin = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      const errorCode = isEmailSignInError(error) ? error.code : 'unknown';

      showToast({
        message: copy.errors[errorCode],
        title: copy.loginErrorTitle,
        type: 'error',
      });
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
            placeholder={copy.emailPlaceholder}
            returnKeyType="next"
            textContentType="emailAddress"
            value={value}
          />
        )}
      />

      <View style={styles.passwordField}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onBlur, onChange, value } }) => (
            <AppInput
              actionLabel={passwordVisible ? copy.hidePassword : copy.showPassword}
              actionIcon={
                <AntDesign
                  name={passwordVisible ? 'eye-invisible' : 'eye'}
                  color={theme.colors.text.secondary}
                  size={22}
                />
              }
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect={false}
              editable={!isSubmitting}
              error={errors.password?.message}
              label={copy.passwordLabel}
              onActionPress={() => setPasswordVisible((visible) => !visible)}
              onBlur={onBlur}
              onChangeText={onChange}
              onSubmitEditing={submitLogin}
              placeholder={copy.passwordPlaceholder}
              returnKeyType="done"
              secureTextEntry={!passwordVisible}
              textContentType="password"
              value={value}
            />
          )}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        hitSlop={theme.spacing.x2}
        onPress={onForgotPassword}
        style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordLabel}>{copy.forgotPassword}</Text>
      </Pressable>

      <View style={styles.loginButton}>
        <AppButton
          disabled={isSubmitting}
          label={isSubmitting ? copy.loggingIn : copy.login}
          loading={isSubmitting}
          variant="primary"
          onPress={submitLogin}
        />
      </View>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerLabel}>{copy.or}</Text>
        <View style={styles.dividerLine} />
      </View>

      <SocialAuthButtons
        disabled={isSubmitting}
        onApplePress={onAppleLogin}
        onGooglePress={onGoogleLogin}
        style={styles.socialActions}
      />

      <View style={styles.createAccountRow}>
        <Text style={styles.createAccountPrompt}>{copy.noAccount}</Text>
        <Pressable
          accessibilityRole="button"
          hitSlop={theme.spacing.x2}
          onPress={onCreateAccount}>
          <Text style={styles.createAccountLink}>{copy.createAccount}</Text>
        </Pressable>
      </View>

      <Text style={styles.securityNote}>{copy.securityNote}</Text>
    </View>
  );
}
