"use client";

import { type Language } from "@/lib/i18n";

type LanguageToggleProps = {
  active?: Language;
  label?: string;
};

function changeLanguage(language: Language) {
  window.localStorage.setItem("einfachamt-language-seen", "true");
  window.localStorage.setItem("einfachamt-language", language);
  document.cookie = `einfachamt-language=${language}; path=/; max-age=31536000; SameSite=Lax`;
  document.documentElement.lang = language;
  window.location.reload();
}

export function LanguageToggle({
  active = "de",
  label = "Sprache auswählen",
}: LanguageToggleProps) {
  return (
    <div className="flex rounded-full bg-white/90 p-1 shadow-sm" aria-label={label}>
      {(["de", "en"] as const).map((language) => (
        <button
          key={language}
          type="button"
          onClick={() => changeLanguage(language)}
          className={`min-h-9 rounded-full px-3 text-sm font-bold ${
            active === language ? "bg-trust-500 text-white" : "text-slate-600"
          }`}
          aria-pressed={active === language}
        >
          {language.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
