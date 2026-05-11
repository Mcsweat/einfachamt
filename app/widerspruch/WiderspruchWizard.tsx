"use client";

import { useState } from "react";
import { type Language, copy } from "@/lib/i18n";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type Props = { language: Language };

type WizardData = {
  type: "kuerzung" | "ablehnung" | "sanktion" | "sonstig";
  datum: string;
  aktenzeichen: string;
  name: string;
  begruendung: string;
};

const EMPTY: WizardData = {
  type: "kuerzung",
  datum: "",
  aktenzeichen: "",
  name: "",
  begruendung: "",
};

// Always German — Widerspruch letters must be in German
function buildLetter(data: WizardData): string {
  const typeLines: Record<WizardData["type"], string> = {
    kuerzung: "die Kürzung meiner Leistungen",
    ablehnung: "die Ablehnung meiner Leistungen",
    sanktion: "die gegen mich verhängte Sanktion",
    sonstig: "Ihren Bescheid",
  };

  const subject = typeLines[data.type];
  const az = data.aktenzeichen ? `Aktenzeichen: ${data.aktenzeichen}` : "";
  const dateLine = data.datum ? `vom ${data.datum}` : "";
  const ref = [dateLine, az].filter(Boolean).join(", ");

  const body = data.begruendung
    ? `\nIch widerspreche aus folgendem Grund:\n\n${data.begruendung}\n`
    : "";

  return `Sehr geehrte Damen und Herren,

hiermit erhebe ich fristwahrend Widerspruch gegen ${subject}${ref ? ` (${ref})` : ""}.
${body}
Ich bitte Sie, den Bescheid vollständig zu überprüfen und mir das Ergebnis schriftlich mitzuteilen. Sollten Sie Rückfragen haben, stehe ich gerne zur Verfügung.

Mit freundlichen Grüßen,
${data.name || "[Dein Name]"}`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-slate-600">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-[0.9rem] border border-slate-200 bg-white px-4 py-3 text-base text-ink placeholder-slate-400 outline-none focus:border-trust-500 focus:ring-2 focus:ring-trust-200"
    />
  );
}

export function WiderspruchWizard({ language }: Props) {
  const t = copy[language];
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(EMPTY);
  const [copied, setCopied] = useState(false);

  function set<K extends keyof WizardData>(key: K, value: WizardData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  const [pdfLoading, setPdfLoading] = useState(false);
  const typeKeys: WizardData["type"][] = ["kuerzung", "ablehnung", "sanktion", "sonstig"];
  const letter = buildLetter(data);

  async function copyLetter() {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  async function downloadPdf() {
    setPdfLoading(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const margin = 72;
      const contentWidth = page.getWidth() - margin * 2;
      const fontSize = 11;
      const lineHeight = 18;
      const blue = rgb(0.04, 0.52, 1);
      const ink = rgb(0.07, 0.09, 0.15);
      const muted = rgb(0.5, 0.5, 0.55);
      const rule = rgb(0.84, 0.84, 0.88);

      function wrapLine(text: string, maxWidth: number): string[] {
        const words = text.split(" ");
        const lines: string[] = [];
        let current = "";
        for (const word of words) {
          const test = current ? `${current} ${word}` : word;
          if (font.widthOfTextAtSize(test, fontSize) > maxWidth && current) {
            lines.push(current);
            current = word;
          } else {
            current = test;
          }
        }
        if (current) lines.push(current);
        return lines.length ? lines : [""];
      }

      let y = page.getHeight() - margin;

      // ── Header ──
      page.drawText("EinfachAmt", { x: margin, y, font: boldFont, size: 10, color: blue });
      const today = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
      const dateW = font.widthOfTextAtSize(today, 10);
      page.drawText(today, { x: page.getWidth() - margin - dateW, y, font, size: 10, color: muted });
      y -= 16;
      page.drawLine({ start: { x: margin, y }, end: { x: page.getWidth() - margin, y }, thickness: 0.5, color: rule });
      y -= 28;

      // ── Title ──
      page.drawText("Widerspruch", { x: margin, y, font: boldFont, size: 20, color: ink });
      y -= 36;

      // ── Letter body ──
      const paragraphs = letter.split("\n");
      for (const para of paragraphs) {
        if (y < 80) break;
        if (!para.trim()) {
          y -= lineHeight * 0.65;
          continue;
        }
        const lines = wrapLine(para, contentWidth);
        for (const line of lines) {
          if (y < 80) break;
          page.drawText(line, { x: margin, y, font, size: fontSize, color: ink });
          y -= lineHeight;
        }
      }

      // ── Footer ──
      const footerY = 44;
      page.drawLine({ start: { x: margin, y: footerY + 14 }, end: { x: page.getWidth() - margin, y: footerY + 14 }, thickness: 0.5, color: rule });
      page.drawText(
        "Erstellt mit EinfachAmt · einfachamt.com · Kein offizieller Behördendienst · Keine Rechtsberatung",
        { x: margin, y: footerY, font, size: 8, color: muted },
      );

      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `widerspruch${data.name ? `-${data.name.toLowerCase().replace(/\s+/g, "-")}` : ""}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setPdfLoading(false);
    }
  }

  const steps = [
    // Step 0 — Type & Details
    <div key="details" className="space-y-4">
      <Field label={t.widerspruchType}>
        <div className="grid grid-cols-2 gap-2">
          {typeKeys.map((key, i) => (
            <button
              key={key}
              type="button"
              onClick={() => set("type", key)}
              className={`rounded-[0.9rem] px-3 py-3 text-sm font-bold transition active:scale-[0.97] ${
                data.type === key ? "bg-trust-500 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              {t.widerspruchTypeOpts[i]}
            </button>
          ))}
        </div>
      </Field>
      <Field label={t.widerspruchDatum}>
        <Input value={data.datum} onChange={(v) => set("datum", v)} placeholder="15.04.2025" />
      </Field>
      <Field label={t.widerspruchAktenzeichen}>
        <Input value={data.aktenzeichen} onChange={(v) => set("aktenzeichen", v)} placeholder="JC-2025-12345" />
      </Field>
      <Field label={t.widerspruchName}>
        <Input value={data.name} onChange={(v) => set("name", v)} placeholder="Max Mustermann" />
      </Field>
    </div>,

    // Step 1 — Reason
    <div key="reason" className="space-y-4">
      <Field label={t.widerspruchBegruendung}>
        <textarea
          value={data.begruendung}
          onChange={(e) => set("begruendung", e.target.value)}
          placeholder={t.widerspruchBegruendungHint}
          rows={5}
          className="w-full rounded-[0.9rem] border border-slate-200 bg-white px-4 py-3 text-base text-ink placeholder-slate-400 outline-none focus:border-trust-500 focus:ring-2 focus:ring-trust-200"
        />
      </Field>
      <p className="text-xs text-slate-400">{t.widerspruchBegruendungHint}</p>
    </div>,

    // Step 2 — Draft
    <div key="draft" className="space-y-4">
      {/* Letter preview */}
      <div className="rounded-[1.2rem] bg-slate-50 p-4">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-800">
          {letter}
        </pre>
      </div>

      {/* Copy button */}
      <button
        type="button"
        onClick={copyLetter}
        className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-base font-bold transition active:scale-[0.98] ${
          copied
            ? "bg-emerald-500 text-white"
            : "bg-trust-500 text-white shadow-soft"
        }`}
      >
        {copied ? t.widerspruchCopied : `📋 ${t.widerspruchCopy}`}
      </button>

      {/* PDF download */}
      <button
        type="button"
        onClick={downloadPdf}
        disabled={pdfLoading}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-800 px-5 text-base font-bold text-white transition active:scale-[0.98] disabled:opacity-60"
      >
        {pdfLoading
          ? (language === "de" ? "PDF wird erstellt…" : "Creating PDF…")
          : `⬇ ${language === "de" ? "Als PDF herunterladen" : "Download as PDF"}`}
      </button>

      {/* Disclaimer */}
      <div className="rounded-[1.2rem] bg-amber-50 p-4">
        <p className="text-xs font-semibold leading-5 text-amber-900">{t.widerspruchDisclaimer}</p>
      </div>
    </div>,
  ];

  const TOTAL = steps.length;

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>{t.widerspruchSteps[step]}</span>
          <span>{step + 1} / {TOTAL}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-trust-100">
          <div
            className="h-full rounded-full bg-trust-500 transition-all duration-300"
            style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-ink">{t.widerspruchSteps[step]}</h2>

      <div className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
        {steps[step]}
      </div>

      <div className="flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-slate-100 text-base font-bold text-slate-700 transition active:scale-[0.97]"
          >
            ← {t.widerspruchBack}
          </button>
        )}
        {step < TOTAL - 1 && (
          <button
            type="button"
            onClick={() => {
              if (step === 0) setStep(1);
              else if (step === 1) setStep(2);
            }}
            className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-trust-500 text-base font-bold text-white shadow-sm transition active:scale-[0.97]"
          >
            {step === 1 ? `📄 ${t.widerspruchGenerate}` : `${t.widerspruchNext} →`}
          </button>
        )}
      </div>
    </div>
  );
}
