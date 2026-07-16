import * as yup from 'yup';

export type LoginFormValues = {
  email: string;
  password: string;
};

type LoginValidationMessages = {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
};

export const createLoginSchema = (messages: LoginValidationMessages) =>
  yup.object({
    email: yup.string().trim().required(messages.emailRequired).email(messages.emailInvalid),
    password: yup.string().required(messages.passwordRequired),
  });
