import { useLocales } from 'expo-localization';
import { createContext, type PropsWithChildren, useContext, useMemo } from 'react';

import { translations } from '@/localization/translations';
import type { SupportedLanguage, TranslationSchema } from '@/localization/types';

const DEFAULT_LANGUAGE: SupportedLanguage = 'uk';

type AppLocalization = Readonly<{
  language: SupportedLanguage;
  translations: TranslationSchema;
}>;

const AppLocalizationContext = createContext<AppLocalization | null>(null);

type AppLocalizationProviderProps = PropsWithChildren<{
  /** Explicit override for previews, tests, and a future language setting. */
  language?: SupportedLanguage;
}>;

export function AppLocalizationProvider({
  children,
  language,
}: AppLocalizationProviderProps) {
  const locales = useLocales();
  const systemLanguage = resolveLanguage(locales[0]?.languageCode);
  const resolvedLanguage = language ?? systemLanguage;
  const value = useMemo<AppLocalization>(
    () => ({
      language: resolvedLanguage,
      translations: translations[resolvedLanguage],
    }),
    [resolvedLanguage],
  );

  return (
    <AppLocalizationContext.Provider value={value}>
      {children}
    </AppLocalizationContext.Provider>
  );
}

export function useAppLocalization() {
  const localization = useContext(AppLocalizationContext);

  if (!localization) {
    throw new Error('useAppLocalization must be used inside AppLocalizationProvider');
  }

  return localization;
}

function resolveLanguage(languageCode: string | null | undefined): SupportedLanguage {
  return languageCode === 'en' ? 'en' : DEFAULT_LANGUAGE;
}
