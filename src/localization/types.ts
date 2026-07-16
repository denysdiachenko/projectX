export type SupportedLanguage = 'uk' | 'en';

export type TranslationSchema = {
  common: {
    cancel: string;
    dismiss: string;
    socialAuth: {
      continueWithGoogle: string;
      continueWithApple: string;
      googleErrorTitle: string;
      appleUnavailableTitle: string;
      appleUnavailableMessage: string;
      errors: {
        providerDisabled: string;
        network: string;
        invalidCallback: string;
        unknown: string;
      };
    };
  };
  welcome: {
    eyebrow: string;
    title: string;
    subtitle: string;
    createAccount: string;
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
    loginErrorTitle: string;
    loginSuccess: string;
    loginSuccessTitle: string;
    loggingIn: string;
    or: string;
    noAccount: string;
    createAccount: string;
    securityNote: string;
    errors: {
      invalidCredentials: string;
      emailNotConfirmed: string;
      rateLimited: string;
      network: string;
      unknown: string;
    };
    validation: {
      emailRequired: string;
      emailInvalid: string;
      passwordRequired: string;
    };
  };
  createAccount: {
    back: string;
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    showPassword: string;
    hidePassword: string;
    submit: string;
    submitting: string;
    or: string;
    existingAccount: string;
    login: string;
    legal: string;
    successTitle: string;
    success: string;
    confirmationTitle: string;
    confirmationMessage: string;
    errorTitle: string;
    errors: {
      emailAlreadyRegistered: string;
      invalidEmail: string;
      weakPassword: string;
      signUpDisabled: string;
      rateLimited: string;
      network: string;
      unknown: string;
    };
    validation: {
      nameRequired: string;
      nameTooLong: string;
      emailRequired: string;
      emailInvalid: string;
      passwordRequired: string;
      passwordTooShort: string;
    };
  };
  myEvents: {
    title: string;
    greeting: string;
    defaultName: string;
    openProfile: string;
    emptyTitle: string;
    emptyBody: string;
    createEvent: string;
    hintTitle: string;
    hintBody: string;
  };
  profile: {
    back: string;
    title: string;
    editTitle: string;
    defaultName: string;
    emailPlaceholder: string;
    editProfile: string;
    changePhoto: string;
    nameLabel: string;
    emailLabel: string;
    save: string;
    saving: string;
    settingsSection: string;
    language: string;
    languageOptions: {
      uk: string;
      en: string;
    };
    theme: string;
    themeOptions: {
      system: string;
      light: string;
      dark: string;
    };
    settingSaveErrorTitle: string;
    settingSaveError: string;
    accountSection: string;
    changePassword: string;
    legalSection: string;
    privacyPolicy: string;
    terms: string;
    deleteAccount: string;
    logout: string;
    loggingOut: string;
    logoutSuccessTitle: string;
    logoutSuccess: string;
    logoutErrorTitle: string;
    logoutError: string;
    loadErrorTitle: string;
    loadError: string;
    saveSuccessTitle: string;
    saveSuccess: string;
    saveErrorTitle: string;
    saveError: string;
    avatarPermissionTitle: string;
    avatarPermissionError: string;
    unavailableTitle: string;
    unavailableMessage: string;
    deleteConfirmTitle: string;
    deleteConfirmMessage: string;
    deleteConfirmAction: string;
    deleteCancelAction: string;
    deletingAccount: string;
    deleteErrorTitle: string;
    deleteError: string;
    privacyPlaceholderTitle: string;
    privacyPlaceholderMessage: string;
    termsPlaceholderTitle: string;
    termsPlaceholderMessage: string;
    validation: {
      nameRequired: string;
      nameTooLong: string;
    };
  };
};
