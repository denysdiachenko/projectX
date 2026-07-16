import type { TranslationSchema } from '@/localization/types';

export const en: TranslationSchema = {
  common: {
    dismiss: 'Dismiss message',
  },
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
    loginErrorTitle: 'Unable to sign in',
    loginSuccess: 'You have signed in successfully.',
    loginSuccessTitle: 'Signed in',
    loggingIn: 'Signing in…',
    or: 'or',
    continueWithGoogle: 'Continue with Google',
    continueWithApple: 'Continue with Apple',
    noAccount: "Don't have an account?",
    createAccount: 'Create account',
    securityNote: 'Your data is protected and never shared with third parties',
    errors: {
      invalidCredentials: 'Incorrect email or password.',
      emailNotConfirmed: 'Confirm your email before signing in.',
      rateLimited: 'Too many sign-in attempts. Please try again later.',
      network: 'Unable to connect. Check your internet connection and try again.',
      unknown: 'Unable to sign in. Please try again.',
    },
    validation: {
      emailRequired: 'Enter your email',
      emailInvalid: 'Enter a valid email',
      passwordRequired: 'Enter your password',
    },
  },
  myEvents: {
    title: 'My events',
    placeholder: 'Your planned events will appear here.',
  },
};
