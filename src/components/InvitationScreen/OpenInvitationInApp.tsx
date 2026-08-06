import * as Linking from 'expo-linking';
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { Platform } from 'react-native';

import AppButton from '@/components/AppButton/AppButton';
import { buildInvitationAppUrl } from '@/services/invitations';

type OpenInvitationInAppProps = {
  label: string;
  token: string;
};

export default function OpenInvitationInApp({
  label,
  token,
}: OpenInvitationInAppProps) {
  const isMobileWeb = useSyncExternalStore(
    subscribeToBrowserEnvironment,
    isMobileBrowser,
    () => false,
  );
  const appUrl = buildInvitationAppUrl(token);
  const openApp = useCallback(() => {
    void Linking.openURL(appUrl).catch(() => undefined);
  }, [appUrl]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    if (!isMobileBrowser() || alreadyAttempted(token)) return;

    const timeout = window.setTimeout(openApp, 400);
    return () => window.clearTimeout(timeout);
  }, [openApp, token]);

  if (Platform.OS !== 'web' || !isMobileWeb) return null;

  return <AppButton label={label} onPress={openApp} variant="social" />;
}

function isMobileBrowser() {
  if (Platform.OS !== 'web' || typeof navigator === 'undefined') return false;

  const mobileUserAgent = /Android|iPad|iPhone|iPod/i.test(navigator.userAgent);
  const modernIPad = navigator.platform === 'MacIntel'
    && navigator.maxTouchPoints > 1;

  return mobileUserAgent || modernIPad;
}

function subscribeToBrowserEnvironment() {
  return () => undefined;
}

function alreadyAttempted(token: string) {
  try {
    const key = `invitation-app-open:${token}`;

    if (window.sessionStorage.getItem(key)) return true;
    window.sessionStorage.setItem(key, '1');
    return false;
  } catch {
    return false;
  }
}
