import { useLocales } from 'expo-localization';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useAppAuth } from '@/hooks/app-auth';
import { translations } from '@/localization/translations';
import type { SupportedLanguage, TranslationSchema } from '@/localization/types';
import { getStoredLanguage, storeLanguage } from '@/services/preferences-storage';
import { getUserProfile, updateProfileLocale } from '@/services/profile';

const DEFAULT_LANGUAGE: SupportedLanguage = 'uk';

type AppLocalization = Readonly<{
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => Promise<void>;
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
  const { user } = useAppAuth();
  const locales = useLocales();
  const systemLanguage = resolveLanguage(locales[0]?.languageCode);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    () => language ?? getStoredLanguage() ?? systemLanguage,
  );
  const resolvedLanguage = language ?? selectedLanguage;

  useEffect(() => {
    if (language || !user) {
      return;
    }

    let active = true;

    void getUserProfile(user.id)
      .then((profile) => {
        if (active && isSupportedLanguage(profile.locale)) {
          setSelectedLanguage(profile.locale);
          storeLanguage(profile.locale);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [language, user]);

  const setLanguage = useCallback(
    async (nextLanguage: SupportedLanguage) => {
      const previousLanguage = selectedLanguage;
      setSelectedLanguage(nextLanguage);
      storeLanguage(nextLanguage);

      if (!user) {
        return;
      }

      try {
        await updateProfileLocale(user.id, nextLanguage);
      } catch (error) {
        setSelectedLanguage(previousLanguage);
        storeLanguage(previousLanguage);
        throw error;
      }
    },
    [selectedLanguage, user],
  );

  const value = useMemo<AppLocalization>(
    () => ({
      language: resolvedLanguage,
      setLanguage,
      translations: translations[resolvedLanguage],
    }),
    [resolvedLanguage, setLanguage],
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

function isSupportedLanguage(language: string): language is SupportedLanguage {
  return language === 'uk' || language === 'en';
}
