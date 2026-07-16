import { isAuthApiError, isAuthRetryableFetchError } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

export type EmailSignInErrorCode =
  | 'invalidCredentials'
  | 'emailNotConfirmed'
  | 'rateLimited'
  | 'network'
  | 'unknown';

export type EmailSignUpErrorCode =
  | 'emailAlreadyRegistered'
  | 'invalidEmail'
  | 'weakPassword'
  | 'signUpDisabled'
  | 'rateLimited'
  | 'network'
  | 'unknown';

export class EmailSignInError extends Error {
  readonly code: EmailSignInErrorCode;

  constructor(code: EmailSignInErrorCode) {
    super(code);
    this.name = 'EmailSignInError';
    this.code = code;
  }
}

export function isEmailSignInError(error: unknown): error is EmailSignInError {
  return error instanceof EmailSignInError;
}

export class EmailSignUpError extends Error {
  readonly code: EmailSignUpErrorCode;

  constructor(code: EmailSignUpErrorCode) {
    super(code);
    this.name = 'EmailSignUpError';
    this.code = code;
  }
}

export function isEmailSignUpError(error: unknown): error is EmailSignUpError {
  return error instanceof EmailSignUpError;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (!error) {
    return data;
  }

  if (isAuthRetryableFetchError(error) || error.code === 'request_timeout') {
    throw new EmailSignInError('network');
  }

  if (isAuthApiError(error)) {
    if (error.code === 'invalid_credentials') {
      throw new EmailSignInError('invalidCredentials');
    }

    if (error.code === 'email_not_confirmed') {
      throw new EmailSignInError('emailNotConfirmed');
    }

    if (error.code === 'over_request_rate_limit' || error.status === 429) {
      throw new EmailSignInError('rateLimited');
    }
  }

  throw new EmailSignInError('unknown');
}

type SignUpWithEmailInput = {
  displayName: string;
  email: string;
  locale: 'uk' | 'en';
  password: string;
};

export async function signUpWithEmail({
  displayName,
  email,
  locale,
  password,
}: SignUpWithEmailInput) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        display_name: displayName.trim(),
        locale,
      },
    },
  });

  if (!error) {
    return data;
  }

  if (isAuthRetryableFetchError(error) || error.code === 'request_timeout') {
    throw new EmailSignUpError('network');
  }

  if (isAuthApiError(error)) {
    if (error.code === 'user_already_exists') {
      throw new EmailSignUpError('emailAlreadyRegistered');
    }

    if (error.code === 'email_address_invalid') {
      throw new EmailSignUpError('invalidEmail');
    }

    if (error.code === 'weak_password') {
      throw new EmailSignUpError('weakPassword');
    }

    if (error.code === 'signup_disabled') {
      throw new EmailSignUpError('signUpDisabled');
    }

    if (error.code === 'over_request_rate_limit' || error.status === 429) {
      throw new EmailSignUpError('rateLimited');
    }
  }

  throw new EmailSignUpError('unknown');
}

export async function signOutCurrentSession() {
  const { error } = await supabase.auth.signOut({ scope: 'local' });

  if (error) {
    throw error;
  }
}

export async function deleteCurrentAccount() {
  const { error } = await supabase.functions.invoke('delete-account', {
    method: 'DELETE',
  });

  if (error) {
    throw error;
  }

  await signOutCurrentSession();
}
