import type { SupportedLanguage } from '@/localization/types';

export type ThemeMode = 'system' | 'light' | 'dark';

const LANGUAGE_KEY = 'preferences.language';
const THEME_MODE_KEY = 'preferences.themeMode';

function getItem(key: string): string | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setItem(key: string, value: string) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(key, value);
  } catch {
    // Preferences remain in memory when browser storage is unavailable.
  }
}

export function getStoredLanguage(): SupportedLanguage | null {
  const language = getItem(LANGUAGE_KEY);
  return language === 'uk' || language === 'en' ? language : null;
}

export function storeLanguage(language: SupportedLanguage) {
  setItem(LANGUAGE_KEY, language);
}

export function getStoredThemeMode(): ThemeMode {
  const mode = getItem(THEME_MODE_KEY);
  return mode === 'light' || mode === 'dark' || mode === 'system' ? mode : 'system';
}

export function storeThemeMode(mode: ThemeMode) {
  setItem(THEME_MODE_KEY, mode);
}
