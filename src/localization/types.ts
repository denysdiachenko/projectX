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
    greetingWithEvents: string;
    defaultName: string;
    openProfile: string;
    emptyTitle: string;
    emptyBody: string;
    createEvent: string;
    hintTitle: string;
    hintBody: string;
    guests: string;
    loadError: string;
    retry: string;
    createAnother: string;
  };
  createEvent: {
    headerTitle: string;
    back: string;
    close: string;
    next: string;
    createPlan: string;
    creatingPlan: string;
    step: string;
    steps: {
      eventType: string;
      guests: string;
      details: string;
      menu: string;
      review: string;
    };
    eventType: {
      title: string;
      subtitle: string;
      birthday: string;
      birthdayHint: string;
      bbq: string;
      bbqHint: string;
      homeParty: string;
      homePartyHint: string;
    };
    guests: {
      title: string;
      subtitle: string;
      total: string;
      breakdown: string;
      adults: string;
      adultsHint: string;
      children: string;
      childrenHint: string;
      alcohol: string;
      alcoholHint: string;
      validationHint: string;
    };
    details: {
      title: string;
      subtitle: string;
      name: string;
      namePlaceholder: string;
      date: string;
      time: string;
      timePlaceholder: string;
      duration: string;
      durationHours: string;
      other: string;
      customDurationHint: string;
      location: string;
      indoor: string;
      outdoor: string;
      seasonHint: string;
      seasons: {
        winter: string;
        spring: string;
        summer: string;
        autumn: string;
      };
    };
    menu: {
      title: string;
      subtitle: string;
      format: string;
      snacks: string;
      buffet: string;
      full: string;
      descriptions: {
        snacks: string;
        buffet: string;
        full: string;
      };
      drinks: string;
      beer: string;
      wine: string;
      spirits: string;
      water: string;
      juice: string;
      soda: string;
      waterHint: string;
    };
    review: {
      title: string;
      subtitle: string;
      change: string;
      guestsSummary: string;
      drinksSummary: string;
      budget: string;
      optional: string;
      budgetPlaceholder: string;
      currency: string;
      note: string;
      notePlaceholder: string;
    };
    exit: {
      title: string;
      message: string;
      confirm: string;
      continue: string;
    };
    datePicker: {
      title: string;
      confirm: string;
    };
    validation: {
      eventName: string;
      guests: string;
      customDuration: string;
      eventTime: string;
    };
    planSuccessTitle: string;
    planSuccessMessage: string;
    planErrorTitle: string;
    planErrorMessage: string;
  };
  eventPlan: {
    headerTitle: string;
    readyTitle: string;
    readyMessage: string;
    context: string;
    tabs: {
      plan: string;
      shopping: string;
      checklist: string;
    };
    sections: {
      food: string;
      drinks: string;
      supplies: string;
    };
    categories: Record<string, string>;
    units: {
      kg: string;
      l: string;
      pcs: string;
    };
    seasons: Record<string, string>;
    locations: Record<string, string>;
    productsNoteTitle: string;
    productsNoteBody: string;
    unavailableTitle: string;
    unavailableMessage: string;
    loadError: string;
    retry: string;
  };
  eventManagement: {
    actionsLabel: string;
    actionsTitle: string;
    editAction: string;
    deleteAction: string;
    cancel: string;
    editTitle: string;
    saveChanges: string;
    savingChanges: string;
    loadError: string;
    retry: string;
    updateSuccessTitle: string;
    updateSuccessMessage: string;
    updateErrorTitle: string;
    updateErrorMessage: string;
    deleteConfirmTitle: string;
    deleteConfirmMessage: string;
    deleting: string;
    deleteSuccessTitle: string;
    deleteSuccessMessage: string;
    deleteErrorTitle: string;
    deleteErrorMessage: string;
    exit: {
      title: string;
      message: string;
      confirm: string;
      continue: string;
    };
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
