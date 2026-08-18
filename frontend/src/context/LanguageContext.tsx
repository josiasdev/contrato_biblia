"use client";

import React, { createContext, useContext, useState } from "react";
import { Locale, translations } from "@/i18n/translations";

interface LanguageContextType {
  locale: Locale;
  setLocale: (lang: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("pt");

  const t = (key: string): string => {
    return translations[locale]?.[key] || translations["pt"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation deve ser usado dentro de LanguageProvider");
  }
  return context;
}
