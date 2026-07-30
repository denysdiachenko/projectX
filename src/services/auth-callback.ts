import type { EmailOtpType } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

export class AuthCallbackError extends Error {
  constructor() {
    super('Unable to create an auth session from the callback URL');
    this.name = 'AuthCallbackError';
  }
}

export async function createSessionFromAuthUrl(callbackUrl: string) {
  const url = new URL(callbackUrl);
  const queryParams = url.searchParams;
  const fragmentParams = new URLSearchParams(url.hash.replace(/^#/, ''));
  const callbackError =
    queryParams.get('error_description')
    ?? fragmentParams.get('error_description')
    ?? queryParams.get('error')
    ?? fragmentParams.get('error');

  if (callbackError) {
    throw new AuthCallbackError();
  }

  const code = queryParams.get('code');

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) throw new AuthCallbackError();
    return;
  }

  const tokenHash = queryParams.get('token_hash');
  const otpType = queryParams.get('type');

  if (tokenHash && isEmailOtpType(otpType)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: otpType,
    });

    if (error) throw new AuthCallbackError();
    return;
  }

  const accessToken = fragmentParams.get('access_token');
  const refreshToken = fragmentParams.get('refresh_token');

  if (!accessToken || !refreshToken) {
    throw new AuthCallbackError();
  }

  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) throw new AuthCallbackError();
}

function isEmailOtpType(value: string | null): value is EmailOtpType {
  return value === 'email'
    || value === 'email_change'
    || value === 'invite'
    || value === 'magiclink'
    || value === 'recovery'
    || value === 'signup';
}
