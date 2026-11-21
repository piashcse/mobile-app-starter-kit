import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as Localization from 'expo-localization';
import { storage } from '../store/storage';
import {
  supportedLocales,
  translate,
  type LocaleCode,
  type TranslationKey,
} from './catalogs';

const LOCALE_KEY = 'mask.locale';

function deviceLocale(): LocaleCode {
  const code = Localization.getLocales()[0]?.languageCode;
  return supportedLocales.some((locale) => locale.code === code)
    ? (code as LocaleCode)
    : 'en';
}

interface I18nContextValue {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(deviceLocale);

  useEffect(() => {
    let mounted = true;
    void storage.get(LOCALE_KEY).then((saved) => {
      if (
        mounted &&
        saved &&
        supportedLocales.some((entry) => entry.code === saved)
      ) {
        setLocaleState(saved as LocaleCode);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const setLocale = useCallback((next: LocaleCode) => {
    setLocaleState(next);
    void storage.set(LOCALE_KEY, next);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, params) => translate(locale, key, params),
    }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used inside <I18nProvider>.');
  }
  return context;
}
