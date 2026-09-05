import React, { createContext, useContext, ReactNode } from 'react';
import { KEY_TRANSLATIONS } from './translationsData';

export type SupportedLanguage = 'en';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' }
];

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (keyOrText: string, fallback?: string) => string;
  languages: LanguageOption[];
  currentLanguageInfo: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Always standard English
  const language: SupportedLanguage = 'en';
  const setLanguage = () => {};

  try {
    localStorage.removeItem('koyla_language');
    document.documentElement.lang = 'en';
  } catch {
    // Ignore
  }

  const t = (keyOrText: string, fallback?: string): string => {
    if (!keyOrText) return '';
    return fallback || KEY_TRANSLATIONS.en[keyOrText] || keyOrText;
  };

  const currentLanguageInfo: LanguageOption = SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        currentLanguageInfo
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
