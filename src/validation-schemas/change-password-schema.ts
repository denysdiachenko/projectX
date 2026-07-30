import * as yup from 'yup';

export type ChangePasswordFormValues = {
  confirmPassword: string;
  currentPassword: string;
  password: string;
};

type ChangePasswordValidationMessages = {
  confirmPasswordRequired: string;
  currentPasswordRequired: string;
  passwordMismatch: string;
  passwordRequired: string;
  passwordTooShort: string;
};

export const createChangePasswordSchema = (
  messages: ChangePasswordValidationMessages,
  requireCurrentPassword: boolean,
) =>
  yup.object({
    currentPassword: requireCurrentPassword
      ? yup.string().required(messages.currentPasswordRequired)
      : yup.string().defined(),
    password: yup
      .string()
      .required(messages.passwordRequired)
      .min(8, messages.passwordTooShort),
    confirmPassword: yup
      .string()
      .required(messages.confirmPasswordRequired)
      .oneOf([yup.ref('password')], messages.passwordMismatch),
  });
