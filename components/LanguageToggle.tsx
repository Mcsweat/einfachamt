"use client";

import { useState } from "react";
import { languageMeta, type Language } from "@/lib/i18n";
import { LanguageSelector } from "@/components/LanguageSelector";

type LanguageToggleProps = {
  active?: Language;
  label?: string;
};

export function LanguageToggle({
  active = "de",
  label = "Sprache auswählen",
}: LanguageToggleProps) {
  const [open, setOpen] = useState(false);
  const { flag } = languageMeta[active];

  return (
    <>
      <button
        type="button"
        aria-label={label}
        onClick={() => setOpen(true)}
        className="flex h-9 items-center gap-1.5 rounded-full bg-white/90 px-3 shadow-sm text-sm font-bold text-slate-700 transition active:scale-95"
      >
        <span className="text-base leading-none">{flag}</span>
        <span className="text-xs font-bold text-slate-500 uppercase leading-none">{active}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
          className="text-slate-400"
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <LanguageSelector active={active} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
