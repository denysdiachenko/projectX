import { getCalendars } from 'expo-localization';

export function getDeviceTimeZone() {
  return getCalendars()[0]?.timeZone
    ?? Intl.DateTimeFormat().resolvedOptions().timeZone
    ?? 'UTC';
}
