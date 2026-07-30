import * as yup from 'yup';

export type ForgotPasswordFormValues = {
  email: string;
};

type ForgotPasswordValidationMessages = {
  emailInvalid: string;
  emailRequired: string;
};

export const createForgotPasswordSchema = (
  messages: ForgotPasswordValidationMessages,
) =>
  yup.object({
    email: yup
      .string()
      .trim()
      .required(messages.emailRequired)
      .email(messages.emailInvalid),
  });
