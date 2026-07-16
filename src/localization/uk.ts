import type { TranslationSchema } from '@/localization/types';

export const uk: TranslationSchema = {
  common: {
    dismiss: 'Закрити повідомлення',
  },
  welcome: {
    eyebrow: 'ВЕЧІРКА БЕЗ СТРЕСУ',
    title: 'Сплануй вечірку\nза кілька хвилин',
    subtitle:
      'Розрахуємо їжу, напої та покупки — тобі залишиться лише відмічати готове.',
    createAccount: 'Створити акаунт',
    continueWithGoogle: 'Продовжити з Google',
    continueWithApple: 'Продовжити з Apple',
    existingAccount: 'Вже є акаунт?',
    login: 'Увійти',
    legal: 'Продовжуючи, ти погоджуєшся з Умовами та Політикою конфіденційності',
  },
  login: {
    back: 'Назад',
    title: 'З поверненням!',
    subtitle: 'Увійди, щоб продовжити планування вечірки.',
    emailLabel: 'Email',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'Пароль',
    passwordPlaceholder: 'Введіть пароль',
    showPassword: 'Показати',
    hidePassword: 'Сховати',
    forgotPassword: 'Забули пароль?',
    login: 'Увійти',
    loginErrorTitle: 'Не вдалося увійти',
    loginSuccess: 'Ви успішно увійшли.',
    loginSuccessTitle: 'Вхід виконано',
    loggingIn: 'Входимо…',
    or: 'або',
    continueWithGoogle: 'Продовжити з Google',
    continueWithApple: 'Продовжити з Apple',
    noAccount: 'Немає акаунта?',
    createAccount: 'Створити акаунт',
    securityNote: 'Твої дані захищені та не передаються третім особам',
    errors: {
      invalidCredentials: 'Неправильний email або пароль.',
      emailNotConfirmed: 'Підтвердіть email перед входом.',
      rateLimited: 'Забагато спроб входу. Спробуйте трохи пізніше.',
      network: 'Не вдалося підключитися. Перевірте інтернет і спробуйте ще раз.',
      unknown: 'Не вдалося увійти. Спробуйте ще раз.',
    },
    validation: {
      emailRequired: 'Введіть email',
      emailInvalid: 'Введіть коректний email',
      passwordRequired: 'Введіть пароль',
    },
  },
  myEvents: {
    title: 'Мої події',
    placeholder: 'Тут з’являться ваші заплановані події.',
  },
};
