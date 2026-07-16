import Storage from 'expo-sqlite/kv-store';

import type { SupportedLanguage } from '@/localization/types';

export type ThemeMode = 'system' | 'light' | 'dark';

const LANGUAGE_KEY = 'preferences.language';
const THEME_MODE_KEY = 'preferences.themeMode';

export function getStoredLanguage(): SupportedLanguage | null {
  const language = Storage.getItemSync(LANGUAGE_KEY);
  return language === 'uk' || language === 'en' ? language : null;
}

export function storeLanguage(language: SupportedLanguage) {
  Storage.setItemSync(LANGUAGE_KEY, language);
}

export function getStoredThemeMode(): ThemeMode {
  const mode = Storage.getItemSync(THEME_MODE_KEY);
  return mode === 'light' || mode === 'dark' || mode === 'system' ? mode : 'system';
}

export function storeThemeMode(mode: ThemeMode) {
  Storage.setItemSync(THEME_MODE_KEY, mode);
}
