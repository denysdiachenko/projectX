import * as WebBrowser from 'expo-web-browser';
import { isAuthRetryableFetchError } from '@supabase/supabase-js';

import { AUTH_REDIRECT_URL } from '@/constants/auth';
import { supabase } from '@/lib/supabase';

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

function getCallbackParams(callbackUrl: string) {
  const url = new URL(callbackUrl);
  const queryParams = url.searchParams;
  const fragmentParams = new URLSearchParams(url.hash.replace(/^#/, ''));

  return { queryParams, fragmentParams };
}

async function createSessionFromCallback(callbackUrl: string) {
  const { fragmentParams, queryParams } = getCallbackParams(callbackUrl);
  const callbackError =
    queryParams.get('error_description') ??
    fragmentParams.get('error_description') ??
    queryParams.get('error') ??
    fragmentParams.get('error');

  if (callbackError) {
    throw new SocialAuthError('unknown');
  }

  const code = queryParams.get('code');

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      throw new SocialAuthError('invalidCallback');
    }

    return;
  }

  const accessToken = fragmentParams.get('access_token');
  const refreshToken = fragmentParams.get('refresh_token');

  if (!accessToken || !refreshToken) {
    throw new SocialAuthError('invalidCallback');
  }

  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    throw new SocialAuthError('invalidCallback');
  }
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

  await createSessionFromCallback(result.url);

  return 'signedIn';
}
