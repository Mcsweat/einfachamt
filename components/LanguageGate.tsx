"use client";

import { useEffect, useState } from "react";
import { languageMeta, type Language } from "@/lib/i18n";
import { LanguageSelector } from "@/components/LanguageSelector";

const VALID_LANGUAGES = Object.keys(languageMeta) as Language[];

function getSavedLanguage(): Language {
  const saved = window.localStorage.getItem("einfachamt-language");
  return VALID_LANGUAGES.includes(saved as Language) ? (saved as Language) : "de";
}

export function LanguageGate() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setCurrentLanguage] = useState<Language>("de");

  useEffect(() => {
    const lang = getSavedLanguage();
    setCurrentLanguage(lang);

    if (!window.localStorage.getItem("einfachamt-language-seen")) {
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <LanguageSelector
      active={language}
      onClose={() => {
        // Mark as seen even if dismissed — we don't nag again
        window.localStorage.setItem("einfachamt-language-seen", "true");
        setIsOpen(false);
      }}
    />
  );
}
