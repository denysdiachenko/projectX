import type { TranslationSchema } from '@/localization/types';

export const en: TranslationSchema = {
  welcome: {
    eyebrow: 'A STRESS-FREE PARTY',
    title: 'Plan your party\nin just a few minutes',
    subtitle:
      "We'll calculate the food, drinks, and shopping — all you need to do is check things off.",
    createAccount: 'Create account',
    continueWithGoogle: 'Continue with Google',
    continueWithApple: 'Continue with Apple',
    existingAccount: 'Already have an account?',
    login: 'Sign in',
    legal: 'By continuing, you agree to the Terms and Privacy Policy',
  },
  login: {
    back: 'Back',
    title: 'Welcome back!',
    subtitle: 'Sign in to continue planning your party.',
    emailLabel: 'Email',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    showPassword: 'Show',
    hidePassword: 'Hide',
    forgotPassword: 'Forgot password?',
    login: 'Sign in',
    or: 'or',
    continueWithGoogle: 'Continue with Google',
    continueWithApple: 'Continue with Apple',
    noAccount: "Don't have an account?",
    createAccount: 'Create account',
    securityNote: 'Your data is protected and never shared with third parties',
    validation: {
      emailRequired: 'Enter your email',
      emailInvalid: 'Enter a valid email',
      passwordRequired: 'Enter your password',
    },
  },
};
