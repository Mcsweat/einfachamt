"use client";

import { useState } from "react";
import { type AntragFormData } from "@/app/api/antrag/fill/route";
import { type Language, copy } from "@/lib/i18n";

type Props = { language: Language };

const EMPTY: AntragFormData = {
  vorname: "", nachname: "", gebName: "", gebDatum: "", gebOrt: "",
  gebLand: "Deutschland", staat: "deutsch", gender: "m",
  strasse: "", hausnr: "", plz: "", ort: "", tel: "",
  iban: "", kontoinhaber: "",
  rvStatus: "vorhanden", rvNr: "", steurId: "",
  antragAb: "sofort", antragDatum: "",
  famstand: "ledig", kvTyp: "gkv", kvName: "", hatWohnkosten: true, mitbewohner: [],
};

// ── Re-usable field widgets ────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-slate-600">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-[0.9rem] border border-slate-200 bg-white px-4 py-3 text-base text-ink placeholder-slate-400 outline-none focus:border-trust-500 focus:ring-2 focus:ring-trust-200"
    />
  );
}

function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: [string, string][];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-[0.9rem] border border-slate-200 bg-white px-4 py-3 text-base text-ink outline-none focus:border-trust-500 focus:ring-2 focus:ring-trust-200"
    >
      {options.map(([val, label]) => (
        <option key={val} value={val}>{label}</option>
      ))}
    </select>
  );
}

function RadioGroup({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: [string, string][];
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map(([val, label]) => (
        <button
          key={val}
          type="button"
          onClick={() => onChange(val)}
          className={`rounded-[0.9rem] px-3 py-3 text-sm font-bold transition active:scale-[0.97] ${
            value === val
              ? "bg-trust-500 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function CheckboxGroup({ selected, onChange, options }: {
  selected: string[]; onChange: (v: string[]) => void; options: [string, string][];
}) {
  function toggle(val: string) {
    onChange(selected.includes(val) ? selected.filter((x) => x !== val) : [...selected, val]);
  }
  return (
    <div className="space-y-2">
      {options.map(([val, label]) => (
        <button
          key={val}
          type="button"
          onClick={() => toggle(val)}
          className={`flex w-full items-center gap-3 rounded-[0.9rem] px-4 py-3 text-sm font-bold transition active:scale-[0.97] ${
            selected.includes(val)
              ? "bg-trust-500 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-current text-xs">
            {selected.includes(val) ? "✓" : ""}
          </span>
          {label}
        </button>
      ))}
    </div>
  );
}

// ── Main Wizard ───────────────────────────────────────────────────────────

export function AntragWizard({ language }: Props) {
  const t = copy[language].antrag;
  const [step, setStep] = useState(0);
  const [data, setData] = useState<AntragFormData>(EMPTY);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const TOTAL = t.steps.length; // 5

  function set<K extends keyof AntragFormData>(key: K, value: AntragFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function generate() {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/antrag/fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error ?? "Fehler beim Erstellen.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unbekannter Fehler.");
    } finally {
      setGenerating(false);
    }
  }

  // ── Step content ────────────────────────────────────────────────────────

  const genderOpts: [string, string][] = ["m", "w", "d", "k"].map(
    (v, i) => [v, t.genderOpts[i]] as [string, string],
  );
  const rvOpts: [string, string][] = (["vorhanden", "keine", "beantragt"] as const).map(
    (v, i) => [v, t.rvOpts[i]] as [string, string],
  );
  const antragAbOpts: [string, string][] = (["sofort", "spaeter"] as const).map(
    (v, i) => [v, t.antragAbOpts[i]] as [string, string],
  );
  const famOpts: [string, string][] = (
    ["ledig", "verheiratet", "verwitwet", "eingetragen", "getrennt", "geschieden", "aufgehoben"] as const
  ).map((v, i) => [v, t.famOpts[i]] as [string, string]);
  const kvOpts: [string, string][] = (["gkv", "pkv"] as const).map(
    (v, i) => [v, t.kvOpts[i]] as [string, string],
  );
  const mitOpts: [string, string][] = (
    ["ehegatte", "kind", "kindU15", "eltern", "verwandte", "sonstige"] as const
  ).map((v, i) => [v, t.mitOpts[i]] as [string, string]);

  const steps = [
    // Step 0 — Personal
    <div key="personal" className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label={t.vorname}>
          <Input value={data.vorname} onChange={(v) => set("vorname", v)} placeholder="Max" />
        </Field>
        <Field label={t.nachname}>
          <Input value={data.nachname} onChange={(v) => set("nachname", v)} placeholder="Mustermann" />
        </Field>
      </div>
      <Field label={t.gebName}>
        <Input value={data.gebName} onChange={(v) => set("gebName", v)} />
      </Field>
      <Field label={t.gebDatum}>
        <Input value={data.gebDatum} onChange={(v) => set("gebDatum", v)} placeholder="01.01.1990" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t.gebOrt}>
          <Input value={data.gebOrt} onChange={(v) => set("gebOrt", v)} />
        </Field>
        <Field label={t.gebLand}>
          <Input value={data.gebLand} onChange={(v) => set("gebLand", v)} />
        </Field>
      </div>
      <Field label={t.staat}>
        <Input value={data.staat} onChange={(v) => set("staat", v)} />
      </Field>
      <Field label={t.gender}>
        <RadioGroup value={data.gender} onChange={(v) => set("gender", v as AntragFormData["gender"])} options={genderOpts} />
      </Field>
    </div>,

    // Step 1 — Address
    <div key="address" className="space-y-4">
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <Field label={t.strasse}>
          <Input value={data.strasse} onChange={(v) => set("strasse", v)} placeholder="Musterstraße" />
        </Field>
        <Field label={t.hausnr}>
          <Input value={data.hausnr} onChange={(v) => set("hausnr", v)} placeholder="12a" />
        </Field>
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-3">
        <Field label={t.plz}>
          <Input value={data.plz} onChange={(v) => set("plz", v)} placeholder="10115" />
        </Field>
        <Field label={t.ort}>
          <Input value={data.ort} onChange={(v) => set("ort", v)} placeholder="Berlin" />
        </Field>
      </div>
      <Field label={t.tel}>
        <Input value={data.tel} onChange={(v) => set("tel", v)} type="tel" placeholder="+49 170 ..." />
      </Field>
    </div>,

    // Step 2 — Bank & IDs
    <div key="bank" className="space-y-4">
      <Field label={t.iban}>
        <Input value={data.iban} onChange={(v) => set("iban", v)} placeholder="DE89 3704 0044 0532 0130 00" />
      </Field>
      <Field label={t.kontoinhaber}>
        <Input value={data.kontoinhaber} onChange={(v) => set("kontoinhaber", v)} />
      </Field>
      <Field label={t.rvStatus}>
        <RadioGroup value={data.rvStatus} onChange={(v) => set("rvStatus", v as AntragFormData["rvStatus"])} options={rvOpts} />
      </Field>
      {data.rvStatus === "vorhanden" && (
        <Field label={t.rvNr}>
          <Input value={data.rvNr} onChange={(v) => set("rvNr", v)} placeholder="A 123456789" />
        </Field>
      )}
      <Field label={t.steurId}>
        <Input value={data.steurId} onChange={(v) => set("steurId", v)} placeholder="12 345 678 901" />
      </Field>
    </div>,

    // Step 3 — Situation
    <div key="situation" className="space-y-4">
      <Field label={t.antragAb}>
        <RadioGroup value={data.antragAb} onChange={(v) => set("antragAb", v as AntragFormData["antragAb"])} options={antragAbOpts} />
      </Field>
      {data.antragAb === "spaeter" && (
        <Field label={t.antragDatum}>
          <Input value={data.antragDatum} onChange={(v) => set("antragDatum", v)} placeholder="01.01.2025" />
        </Field>
      )}
      <Field label={t.famstand}>
        <Select value={data.famstand} onChange={(v) => set("famstand", v as AntragFormData["famstand"])} options={famOpts} />
      </Field>
      <Field label={t.kvTyp}>
        <RadioGroup value={data.kvTyp} onChange={(v) => set("kvTyp", v as AntragFormData["kvTyp"])} options={kvOpts} />
      </Field>
      <Field label={t.kvName}>
        <Input value={data.kvName} onChange={(v) => set("kvName", v)} placeholder="AOK / TK / ..." />
      </Field>
      <Field label={t.wohnkosten}>
        <RadioGroup
          value={data.hatWohnkosten ? "ja" : "nein"}
          onChange={(v) => set("hatWohnkosten", v === "ja")}
          options={[["ja", t.ja], ["nein", t.nein]]}
        />
      </Field>
      <Field label={t.mitbewohner}>
        <CheckboxGroup
          selected={data.mitbewohner}
          onChange={(v) => set("mitbewohner", v)}
          options={mitOpts}
        />
      </Field>
    </div>,

    // Step 4 — Download
    <div key="done" className="space-y-5">
      {/* Summary */}
      <div className="rounded-[1.2rem] bg-slate-50 p-4 text-sm text-slate-700 space-y-1">
        <p><span className="font-bold">{t.vorname} {t.nachname}:</span> {data.vorname} {data.nachname}</p>
        <p><span className="font-bold">{t.gebDatum}:</span> {data.gebDatum}</p>
        <p><span className="font-bold">{t.ort}:</span> {data.strasse} {data.hausnr}, {data.plz} {data.ort}</p>
        <p><span className="font-bold">{t.iban}:</span> {data.iban || "—"}</p>
      </div>

      {/* Annex note */}
      <div className="rounded-[1.2rem] bg-amber-50 p-4 text-sm font-semibold text-amber-900">
        {t.annexNote}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-500">{t.disclaimer}</p>

      {error && (
        <p className="rounded-[1rem] bg-red-50 p-4 text-sm font-bold text-red-800">{error}</p>
      )}

      {downloadUrl ? (
        <a
          href={downloadUrl}
          download="Buergergeld-Antrag-HA.pdf"
          className="flex min-h-14 items-center justify-center rounded-full bg-emerald-500 px-5 text-center text-lg font-bold text-white shadow-soft transition active:scale-[0.98]"
        >
          ⬇ {t.download}
        </a>
      ) : (
        <button
          type="button"
          onClick={generate}
          disabled={generating}
          className="flex min-h-14 w-full items-center justify-center rounded-full bg-trust-500 px-5 text-center text-lg font-bold text-white shadow-soft transition active:scale-[0.98] disabled:opacity-70"
        >
          {generating ? t.generating : `📄 ${t.generate}`}
        </button>
      )}
    </div>,
  ];

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>{t.steps[step]}</span>
          <span>{step + 1} {t.stepOf} {TOTAL}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-trust-100">
          <div
            className="h-full rounded-full bg-trust-500 transition-all duration-300"
            style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
          />
        </div>
      </div>

      {/* Step label */}
      <h2 className="text-2xl font-bold text-ink">{t.steps[step]}</h2>

      {/* Step form */}
      <div className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
        {steps[step]}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-slate-100 text-base font-bold text-slate-700 transition active:scale-[0.97]"
          >
            ← {t.back}
          </button>
        )}
        {step < TOTAL - 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-trust-500 text-base font-bold text-white shadow-sm transition active:scale-[0.97]"
          >
            {t.next} →
          </button>
        )}
      </div>
    </div>
  );
}
