export type SupportedLanguage = 'uk' | 'en';

export type TranslationSchema = {
  welcome: {
    eyebrow: string;
    title: string;
    subtitle: string;
    createAccount: string;
    continueWithGoogle: string;
    continueWithApple: string;
    existingAccount: string;
    login: string;
    legal: string;
  };
  login: {
    back: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    showPassword: string;
    hidePassword: string;
    forgotPassword: string;
    login: string;
    or: string;
    continueWithGoogle: string;
    continueWithApple: string;
    noAccount: string;
    createAccount: string;
    securityNote: string;
    validation: {
      emailRequired: string;
      emailInvalid: string;
      passwordRequired: string;
    };
  };
};
