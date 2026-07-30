import * as WebBrowser from 'expo-web-browser';
import { isAuthRetryableFetchError } from '@supabase/supabase-js';

import { AUTH_REDIRECT_URL } from '@/constants/auth';
import { supabase } from '@/lib/supabase';

import { createSessionFromAuthUrl } from './auth-callback';

WebBrowser.maybeCompleteAuthSession();

export type SocialAuthErrorCode =
  | 'providerDisabled'
  | 'network'
  | 'invalidCallback'
  | 'unknown';

export class SocialAuthError extends Error {
  readonly code: SocialAuthErrorCode;

  constructor(code: SocialAuthErrorCode) {
    super(code);
    this.name = 'SocialAuthError';
    this.code = code;
  }
}

export function isSocialAuthError(error: unknown): error is SocialAuthError {
  return error instanceof SocialAuthError;
}

export type SocialSignInResult = 'signedIn' | 'cancelled';

export async function signInWithGoogle(): Promise<SocialSignInResult> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: AUTH_REDIRECT_URL,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    if (isAuthRetryableFetchError(error) || error.code === 'request_timeout') {
      throw new SocialAuthError('network');
    }

    if (error.code === 'provider_disabled') {
      throw new SocialAuthError('providerDisabled');
    }

    throw new SocialAuthError('unknown');
  }

  if (!data.url) {
    throw new SocialAuthError('invalidCallback');
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, AUTH_REDIRECT_URL);

  if (result.type !== 'success') {
    return 'cancelled';
  }

  try {
    await createSessionFromAuthUrl(result.url);
  } catch {
    throw new SocialAuthError('invalidCallback');
  }

  return 'signedIn';
}
