import * as yup from 'yup';

export type CreateAccountFormValues = {
  displayName: string;
  email: string;
  password: string;
};

type CreateAccountValidationMessages = {
  nameRequired: string;
  nameTooLong: string;
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordTooShort: string;
};

export const createAccountSchema = (messages: CreateAccountValidationMessages) =>
  yup.object({
    displayName: yup.string().trim().required(messages.nameRequired).max(120, messages.nameTooLong),
    email: yup.string().trim().required(messages.emailRequired).email(messages.emailInvalid),
    password: yup.string().required(messages.passwordRequired).min(8, messages.passwordTooShort),
  });
