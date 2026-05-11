"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type UpsellBannerProps = {
  title: string;
  text: string;
  cta: string;
  documentId: string;
};

export function UpsellBanner({ title, text, cta, documentId }: UpsellBannerProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Only show once per document — don't nag if they already dismissed this one
    const key = `einfachamt:upsell:${documentId}`;
    if (!window.localStorage.getItem(key)) {
      // Small delay so the page content settles first
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, [documentId]);

  if (!visible || dismissed) return null;

  function dismiss() {
    window.localStorage.setItem(`einfachamt:upsell:${documentId}`, "dismissed");
    setDismissed(true);
  }

  return (
    <section
      className="relative overflow-hidden rounded-[1.55rem] bg-trust-500 p-5 shadow-soft"
      style={{ animation: "upsellFadeIn 0.4s ease both" }}
    >
      {/* Decorative circles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10"
      />

      {/* Dismiss button */}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Schließen"
        className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white/80 transition active:scale-95"
      >
        ✕
      </button>

      {/* Eyebrow */}
      <p className="text-xs font-black uppercase tracking-widest text-white/70">Plus</p>

      {/* Title */}
      <h3 className="mt-1 text-xl font-bold leading-tight text-white pr-8">
        {title}
      </h3>

      {/* Body */}
      <p className="mt-2 text-sm leading-6 text-white/85">{text}</p>

      {/* Feature pills */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["50 Briefe/Monat", "PDF-Upload", "OCR", "Gespeichert"].map((f) => (
          <span
            key={f}
            className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold text-white"
          >
            {f}
          </span>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/pricing"
        onClick={dismiss}
        className="mt-4 flex min-h-12 items-center justify-center rounded-full bg-white px-5 text-center text-[15px] font-bold text-trust-700 transition active:scale-[0.98]"
      >
        {cta} →
      </Link>

      <style>{`
        @keyframes upsellFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
