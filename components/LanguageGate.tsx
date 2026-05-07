"use client";

import { useEffect, useState } from "react";
import { copy, type Language } from "@/lib/i18n";

function setLanguage(language: Language) {
  window.localStorage.setItem("einfachamt-language-seen", "true");
  window.localStorage.setItem("einfachamt-language", language);
  document.cookie = `einfachamt-language=${language}; path=/; max-age=31536000; SameSite=Lax`;
  document.documentElement.lang = language;
  window.location.reload();
}

export function LanguageGate() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setCurrentLanguage] = useState<Language>("de");

  useEffect(() => {
    const savedLanguage =
      window.localStorage.getItem("einfachamt-language") === "en" ? "en" : "de";
    setCurrentLanguage(savedLanguage);

    if (!window.localStorage.getItem("einfachamt-language-seen")) {
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) {
    return null;
  }

  const t = copy[language];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/20 px-4 pb-5 backdrop-blur-sm sm:items-center sm:pb-0">
      <section className="w-full max-w-[390px] rounded-[2rem] bg-white p-5 shadow-soft">
        <h2 className="text-3xl font-bold leading-tight text-ink">
          {t.chooseLanguage}
        </h2>
        <p className="mt-3 text-lg leading-7 text-slate-700">
          {t.chooseSubtitle}
        </p>
        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={() => setLanguage("de")}
            className="min-h-14 rounded-full bg-trust-500 px-5 py-4 text-lg font-bold text-white"
          >
            Deutsch
          </button>
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className="min-h-14 rounded-full bg-trust-100 px-5 py-4 text-lg font-bold text-trust-700"
          >
            English
          </button>
        </div>
      </section>
    </div>
  );
}
