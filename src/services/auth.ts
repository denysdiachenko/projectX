import { isAuthApiError, isAuthRetryableFetchError } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

export type EmailSignInErrorCode =
  | 'invalidCredentials'
  | 'emailNotConfirmed'
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
