import { isAuthApiError, isAuthRetryableFetchError } from '@supabase/supabase-js';

import {
  AUTH_REDIRECT_URL,
  PASSWORD_RECOVERY_REDIRECT_URL,
} from '@/constants/auth';
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

export type AccountPasswordErrorCode =
  | 'invalidCurrentPassword'
  | 'invalidEmail'
  | 'network'
  | 'rateLimited'
  | 'samePassword'
  | 'sessionMissing'
  | 'unknown'
  | 'weakPassword';

export class AccountPasswordError extends Error {
  readonly code: AccountPasswordErrorCode;

  constructor(code: AccountPasswordErrorCode) {
    super(code);
    this.name = 'AccountPasswordError';
    this.code = code;
  }
}

export function isAccountPasswordError(
  error: unknown,
): error is AccountPasswordError {
  return error instanceof AccountPasswordError;
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
      emailRedirectTo: AUTH_REDIRECT_URL,
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

export async function resendEmailConfirmation(email: string) {
  const { error } = await supabase.auth.resend({
    email: email.trim(),
    options: { emailRedirectTo: AUTH_REDIRECT_URL },
    type: 'signup',
  });

  if (error) throw mapAccountPasswordError(error);
}

export async function requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: PASSWORD_RECOVERY_REDIRECT_URL,
  });

  if (error) throw mapAccountPasswordError(error);
}

export async function updateAccountPassword({
  currentPassword,
  password,
}: {
  currentPassword?: string;
  password: string;
}) {
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) {
    throw new AccountPasswordError('sessionMissing');
  }

  const { error } = await supabase.auth.updateUser({
    ...(currentPassword ? { current_password: currentPassword } : {}),
    password,
  });

  if (error) throw mapAccountPasswordError(error);
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

function mapAccountPasswordError(error: unknown) {
  if (isAuthRetryableFetchError(error)) {
    return new AccountPasswordError('network');
  }

  if (isAuthApiError(error)) {
    if (error.code === 'email_address_invalid') {
      return new AccountPasswordError('invalidEmail');
    }

    if (
      error.code === 'over_email_send_rate_limit'
      || error.code === 'over_request_rate_limit'
      || error.status === 429
    ) {
      return new AccountPasswordError('rateLimited');
    }

    if (error.code === 'weak_password') {
      return new AccountPasswordError('weakPassword');
    }

    if (error.code === 'same_password') {
      return new AccountPasswordError('samePassword');
    }

    if (
      error.code === 'invalid_credentials'
      || error.code === 'current_password_invalid'
    ) {
      return new AccountPasswordError('invalidCurrentPassword');
    }

    if (error.code === 'session_not_found') {
      return new AccountPasswordError('sessionMissing');
    }
  }

  return new AccountPasswordError('unknown');
}
