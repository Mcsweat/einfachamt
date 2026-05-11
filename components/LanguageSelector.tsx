"use client";

import { useEffect, useRef } from "react";
import { languageMeta, type Language } from "@/lib/i18n";

type LanguageSelectorProps = {
  active: Language;
  onClose: () => void;
};

function applyLanguage(language: Language) {
  window.localStorage.setItem("einfachamt-language-seen", "true");
  window.localStorage.setItem("einfachamt-language", language);
  document.cookie = `einfachamt-language=${language}; path=/; max-age=31536000; SameSite=Lax`;
  document.documentElement.lang = language;
  document.documentElement.dir = languageMeta[language].dir;
  window.location.reload();
}

const LANGUAGE_ORDER: Language[] = ["de", "en", "uk", "ru", "ar", "tr"];

export function LanguageSelector({ active, onClose }: LanguageSelectorProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on backdrop click
  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Trap focus inside sheet
  useEffect(() => {
    sheetRef.current?.focus();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sprache auswählen"
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/30 px-4 pb-5 backdrop-blur-sm sm:items-center sm:pb-0"
      onClick={handleBackdropClick}
    >
      <div
        ref={sheetRef}
        tabIndex={-1}
        className="w-full max-w-[390px] overflow-y-auto rounded-[2rem] bg-white p-5 shadow-soft outline-none"
        style={{ maxHeight: "85svh", animation: "sheetSlideUp 0.28s cubic-bezier(0.32,0.72,0,1) both" }}
      >
        {/* Handle bar */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />

        {/* Title row */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">🌍 Sprache / Language</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Schließen"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 text-sm font-bold transition active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* 2×3 language grid */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {LANGUAGE_ORDER.map((lang) => {
            const { flag, name } = languageMeta[lang];
            const isActive = lang === active;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => applyLanguage(lang)}
                className={`flex items-center gap-3 rounded-[1.2rem] px-4 py-3.5 text-left transition active:scale-[0.97] ${
                  isActive
                    ? "bg-trust-500 text-white shadow-sm"
                    : "bg-slate-50 text-slate-700 hover:bg-trust-100"
                }`}
              >
                <span className="text-2xl leading-none">{flag}</span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-bold leading-tight ${isActive ? "text-white" : "text-ink"}`}>
                    {name}
                  </p>
                </div>
                {isActive && (
                  <span className="ml-auto text-white text-base font-black">✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Note */}
        <p className="mt-4 text-center text-xs text-slate-400">
          Die Antwortentwürfe bleiben auf Deutsch (für Behörden)
        </p>
      </div>

      <style>{`
        @keyframes sheetSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
