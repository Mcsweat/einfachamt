"use client";

import { useState } from "react";
import { type Language } from "@/lib/i18n";
import { type AnlageEKData } from "@/app/api/antrag/fill-ek/route";

type Props = { language: Language };

const EMPTY: AnlageEKData = {
  vorname: "", nachname: "", gebDatum: "", bgNr: "",
  bgVorname: "", bgNachname: "", bgGebDatum: "",
  hatEinkommen: "ja",
  ag1Name: "", ag1Str: "", ag1HausNr: "", ag1Plz: "", ag1Ort: "",
  einkommenMonat: true, einkommenFolgemonat: false,
  ag2Name: "", ag2Str: "", ag2HausNr: "", ag2Plz: "", ag2Ort: "",
  weitereMonat: false, weitereFolgemonat: false,
  istFreiberuflich: "nein", hatEhrenamt: "nein",
  einnahmen: {
    wohngeld: false, arbeitslosengeld: false, krankengeld: false,
    uebergangsgeld: false, kurzarbeitergeld: false, insolvenzgeld: false,
    elterngeld: false, kindergeld: false, kinderzuschlag: false,
    unterhalt: false, unterhaltsvorschuss: false, bafög: false,
    bab: false, ausbildungsgeld: false, renten: false, vermietung: false,
    sozialhilfe: false, sachbezuege: false, digital: false,
    sonstige: false, sonstigeText: "", keine: false,
  },
  hatFahrtkosten: "nein",
  arbeitsstaetteStr: "", arbeitsstaetteHausNr: "", arbeitsstaettePlz: "", arbeitsstaetteOrt: "",
  streckeKm: "", fahrtenProWoche: "",
  fahrtKfz: false, fahrtOeffis: false, fahrtSonstiges: false, fahrtSonstigesText: "",
  fahrkostenZuschuss: "nein", hatAusgaben: "nein",
  versicherungKfz: false, versicherungGesetzlich: true, versicherungAltersvorsorge: false, versicherungPrivat: false,
  hatKinder: "nein", zahltUnterhalt: "nein", hatAusbildungsfoerderung: "nein",
  datumUnterschrift: "",
};

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
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full rounded-[0.9rem] border border-slate-200 bg-white px-4 py-3 text-base text-ink placeholder-slate-400 outline-none focus:border-trust-500 focus:ring-2 focus:ring-trust-200" />
  );
}
function YesNo({ value, onChange, yesLabel, noLabel }: {
  value: "ja" | "nein"; onChange: (v: "ja" | "nein") => void; yesLabel: string; noLabel: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {(["ja", "nein"] as const).map((opt) => (
        <button key={opt} type="button" onClick={() => onChange(opt)}
          className={`rounded-[0.9rem] py-3 text-sm font-bold transition active:scale-[0.97] ${value === opt ? "bg-trust-500 text-white" : "bg-slate-100 text-slate-700"}`}>
          {opt === "ja" ? yesLabel : noLabel}
        </button>
      ))}
    </div>
  );
}
function CheckRow({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`flex min-h-11 w-full items-center gap-3 rounded-[0.9rem] px-4 py-2.5 text-sm font-semibold transition active:scale-[0.97] ${checked ? "bg-trust-50 text-trust-700 ring-2 ring-trust-300" : "bg-slate-50 text-slate-700"}`}>
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black ${checked ? "border-trust-500 bg-trust-500 text-white" : "border-slate-300"}`}>
        {checked ? "✓" : ""}
      </span>
      {label}
    </button>
  );
}

const isDe = (lang: Language) => lang === "de";

export function AnlageEKWizard({ language }: Props) {
  const de = isDe(language);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<AnlageEKData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  function set<K extends keyof AnlageEKData>(key: K, value: AnlageEKData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }
  function setIncome(key: keyof AnlageEKData["einnahmen"], value: boolean | string) {
    setData((prev) => ({ ...prev, einnahmen: { ...prev.einnahmen, [key]: value } }));
  }

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/antrag/fill-ek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(j.error ?? "Fehler beim Erstellen.");
      }
      const blob = await res.blob();
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fehler");
    } finally {
      setLoading(false);
    }
  }

  const STEPS = [
    de ? "Person & BG" : "Person & BG",
    de ? "Arbeitgeber" : "Employer",
    de ? "Einkommensarten" : "Income types",
    de ? "Fahrtkosten & Ausgaben" : "Travel & expenses",
    de ? "Versicherung & Familie" : "Insurance & family",
    de ? "Fertig" : "Done",
  ];
  const TOTAL = STEPS.length;

  const incomeCheckboxes: { key: keyof AnlageEKData["einnahmen"]; labelDe: string; labelEn: string }[] = [
    { key: "arbeitslosengeld", labelDe: "Arbeitslosengeld I/II", labelEn: "Unemployment benefit" },
    { key: "krankengeld", labelDe: "Krankengeld", labelEn: "Sick pay" },
    { key: "elterngeld", labelDe: "Elterngeld", labelEn: "Parental allowance" },
    { key: "kindergeld", labelDe: "Kindergeld", labelEn: "Child benefit" },
    { key: "kinderzuschlag", labelDe: "Kinderzuschlag", labelEn: "Child supplement" },
    { key: "unterhalt", labelDe: "Unterhalt (empfangen)", labelEn: "Maintenance received" },
    { key: "unterhaltsvorschuss", labelDe: "Unterhaltsvorschuss", labelEn: "Maintenance advance" },
    { key: "wohngeld", labelDe: "Wohngeld", labelEn: "Housing benefit" },
    { key: "renten", labelDe: "Rente / Pension", labelEn: "Pension" },
    { key: "bafög", labelDe: "BAföG", labelEn: "BAföG grant" },
    { key: "bab", labelDe: "BAB", labelEn: "BAB training allowance" },
    { key: "ausbildungsgeld", labelDe: "Ausbildungsgeld", labelEn: "Training allowance" },
    { key: "kurzarbeitergeld", labelDe: "Kurzarbeitergeld", labelEn: "Short-time work pay" },
    { key: "insolvenzgeld", labelDe: "Insolvenzgeld", labelEn: "Insolvency benefit" },
    { key: "uebergangsgeld", labelDe: "Übergangsgeld", labelEn: "Transitional benefit" },
    { key: "vermietung", labelDe: "Vermietung / Verpachtung", labelEn: "Rental income" },
    { key: "sozialhilfe", labelDe: "Sozialhilfe", labelEn: "Social assistance" },
    { key: "sachbezuege", labelDe: "Sachbezüge", labelEn: "Benefits in kind" },
    { key: "digital", labelDe: "Digitale Einnahmen", labelEn: "Digital income" },
    { key: "sonstige", labelDe: "Sonstige", labelEn: "Other" },
  ];

  const stepContent = [
    // 0 — Person
    <div key="person" className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label={de ? "Vorname" : "First name"}>
          <Input value={data.vorname} onChange={(v) => set("vorname", v)} placeholder="Max" />
        </Field>
        <Field label={de ? "Nachname" : "Last name"}>
          <Input value={data.nachname} onChange={(v) => set("nachname", v)} placeholder="Mustermann" />
        </Field>
      </div>
      <Field label={de ? "Geburtsdatum (TT.MM.JJJJ)" : "Date of birth (DD.MM.YYYY)"}>
        <Input value={data.gebDatum} onChange={(v) => set("gebDatum", v)} placeholder="01.01.1985" />
      </Field>
      <Field label={de ? "BG-Nummer" : "BG number"}>
        <Input value={data.bgNr} onChange={(v) => set("bgNr", v)} placeholder="12345678" />
      </Field>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{de ? "Partner/in (optional)" : "Partner (optional)"}</p>
      <div className="grid grid-cols-2 gap-3">
        <Field label={de ? "Vorname" : "First name"}>
          <Input value={data.bgVorname} onChange={(v) => set("bgVorname", v)} placeholder="Anna" />
        </Field>
        <Field label={de ? "Nachname" : "Last name"}>
          <Input value={data.bgNachname} onChange={(v) => set("bgNachname", v)} placeholder="Muster" />
        </Field>
      </div>
      <Field label={de ? "Geburtsdatum Partner/in" : "Partner DOB"}>
        <Input value={data.bgGebDatum} onChange={(v) => set("bgGebDatum", v)} placeholder="15.06.1987" />
      </Field>
      <Field label={de ? "Haben Sie Einkommen?" : "Do you have income?"}>
        <YesNo value={data.hatEinkommen} onChange={(v) => set("hatEinkommen", v)} yesLabel={de ? "Ja" : "Yes"} noLabel={de ? "Nein" : "No"} />
      </Field>
    </div>,

    // 1 — Employers
    <div key="ag" className="space-y-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{de ? "Arbeitgeber 1" : "Employer 1"}</p>
      <Field label={de ? "Name des Arbeitgebers" : "Employer name"}>
        <Input value={data.ag1Name} onChange={(v) => set("ag1Name", v)} placeholder="Musterfirma GmbH" />
      </Field>
      <div className="grid grid-cols-[1fr_80px] gap-3">
        <Field label={de ? "Straße" : "Street"}>
          <Input value={data.ag1Str} onChange={(v) => set("ag1Str", v)} placeholder="Musterstraße" />
        </Field>
        <Field label={de ? "Nr." : "No."}>
          <Input value={data.ag1HausNr} onChange={(v) => set("ag1HausNr", v)} placeholder="5" />
        </Field>
      </div>
      <div className="grid grid-cols-[100px_1fr] gap-3">
        <Field label="PLZ">
          <Input value={data.ag1Plz} onChange={(v) => set("ag1Plz", v)} placeholder="60311" />
        </Field>
        <Field label={de ? "Ort" : "City"}>
          <Input value={data.ag1Ort} onChange={(v) => set("ag1Ort", v)} placeholder="Frankfurt" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <CheckRow checked={data.einkommenMonat} onChange={(v) => set("einkommenMonat", v)} label={de ? "Diesen Monat" : "This month"} />
        <CheckRow checked={data.einkommenFolgemonat} onChange={(v) => set("einkommenFolgemonat", v)} label={de ? "Folgemonat" : "Next month"} />
      </div>

      <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">{de ? "Arbeitgeber 2 (optional)" : "Employer 2 (optional)"}</p>
      <Field label={de ? "Name" : "Name"}>
        <Input value={data.ag2Name} onChange={(v) => set("ag2Name", v)} placeholder={de ? "Zweiter Arbeitgeber" : "Second employer"} />
      </Field>
      <div className="grid grid-cols-[1fr_80px] gap-3">
        <Field label={de ? "Straße" : "Street"}>
          <Input value={data.ag2Str} onChange={(v) => set("ag2Str", v)} placeholder="Beispielweg" />
        </Field>
        <Field label="Nr.">
          <Input value={data.ag2HausNr} onChange={(v) => set("ag2HausNr", v)} placeholder="3" />
        </Field>
      </div>
      <div className="grid grid-cols-[100px_1fr] gap-3">
        <Field label="PLZ">
          <Input value={data.ag2Plz} onChange={(v) => set("ag2Plz", v)} placeholder="60313" />
        </Field>
        <Field label={de ? "Ort" : "City"}>
          <Input value={data.ag2Ort} onChange={(v) => set("ag2Ort", v)} placeholder="Frankfurt" />
        </Field>
      </div>
      <Field label={de ? "Selbstständig / freiberuflich?" : "Self-employed / freelance?"}>
        <YesNo value={data.istFreiberuflich} onChange={(v) => set("istFreiberuflich", v)} yesLabel={de ? "Ja" : "Yes"} noLabel={de ? "Nein" : "No"} />
      </Field>
      <Field label={de ? "Ehrenamtliche Aufwandsentschädigung?" : "Volunteer allowance?"}>
        <YesNo value={data.hatEhrenamt} onChange={(v) => set("hatEhrenamt", v)} yesLabel={de ? "Ja" : "Yes"} noLabel={de ? "Nein" : "No"} />
      </Field>
    </div>,

    // 2 — Income types
    <div key="einnahmen" className="space-y-2">
      <p className="text-sm text-slate-500">{de ? "Welche Einnahmen haben Sie? (Alles auswählen, was zutrifft)" : "Select all income types that apply"}</p>
      {incomeCheckboxes.map(({ key, labelDe, labelEn }) => (
        <CheckRow key={key} checked={data.einnahmen[key] as boolean}
          onChange={(v) => setIncome(key, v)} label={de ? labelDe : labelEn} />
      ))}
      {data.einnahmen.sonstige && (
        <Field label={de ? "Sonstige Einnahmen (beschreiben)" : "Other income (describe)"}>
          <Input value={data.einnahmen.sonstigeText} onChange={(v) => setIncome("sonstigeText", v)} placeholder={de ? "z.B. Erbschaft" : "e.g. inheritance"} />
        </Field>
      )}
      <CheckRow checked={data.einnahmen.keine} onChange={(v) => setIncome("keine", v)} label={de ? "Keine Einnahmen" : "No income"} />
    </div>,

    // 3 — Travel
    <div key="fahrt" className="space-y-4">
      <Field label={de ? "Haben Sie Fahrtkosten zur Arbeit?" : "Do you have commuting costs?"}>
        <YesNo value={data.hatFahrtkosten} onChange={(v) => set("hatFahrtkosten", v)} yesLabel={de ? "Ja" : "Yes"} noLabel={de ? "Nein" : "No"} />
      </Field>
      {data.hatFahrtkosten === "ja" && (
        <>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{de ? "Arbeitsstätte" : "Workplace"}</p>
          <div className="grid grid-cols-[1fr_80px] gap-3">
            <Field label={de ? "Straße" : "Street"}>
              <Input value={data.arbeitsstaetteStr} onChange={(v) => set("arbeitsstaetteStr", v)} placeholder="Arbeitsweg 1" />
            </Field>
            <Field label="Nr.">
              <Input value={data.arbeitsstaetteHausNr} onChange={(v) => set("arbeitsstaetteHausNr", v)} placeholder="1" />
            </Field>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-3">
            <Field label="PLZ">
              <Input value={data.arbeitsstaettePlz} onChange={(v) => set("arbeitsstaettePlz", v)} placeholder="60311" />
            </Field>
            <Field label={de ? "Ort" : "City"}>
              <Input value={data.arbeitsstaetteOrt} onChange={(v) => set("arbeitsstaetteOrt", v)} placeholder="Frankfurt" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={de ? "Strecke (km)" : "Distance (km)"}>
              <Input value={data.streckeKm} onChange={(v) => set("streckeKm", v)} placeholder="12" type="number" />
            </Field>
            <Field label={de ? "Fahrten/Woche" : "Trips/week"}>
              <Input value={data.fahrtenProWoche} onChange={(v) => set("fahrtenProWoche", v)} placeholder="5" type="number" />
            </Field>
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{de ? "Verkehrsmittel" : "Transport"}</p>
          <div className="space-y-2">
            <CheckRow checked={data.fahrtKfz} onChange={(v) => set("fahrtKfz", v)} label={de ? "Eigenes Fahrzeug (KFZ)" : "Own vehicle (car)"} />
            <CheckRow checked={data.fahrtOeffis} onChange={(v) => set("fahrtOeffis", v)} label={de ? "Öffentliche Verkehrsmittel" : "Public transport"} />
            <CheckRow checked={data.fahrtSonstiges} onChange={(v) => set("fahrtSonstiges", v)} label={de ? "Sonstiges" : "Other"} />
          </div>
          {data.fahrtSonstiges && (
            <Field label={de ? "Sonstiges Verkehrsmittel" : "Other transport"}>
              <Input value={data.fahrtSonstigesText} onChange={(v) => set("fahrtSonstigesText", v)} placeholder={de ? "z.B. Fahrrad" : "e.g. bicycle"} />
            </Field>
          )}
          <Field label={de ? "Arbeitgeber erstattet Fahrtkosten?" : "Employer reimburses commuting costs?"}>
            <YesNo value={data.fahrkostenZuschuss} onChange={(v) => set("fahrkostenZuschuss", v)} yesLabel={de ? "Ja" : "Yes"} noLabel={de ? "Nein" : "No"} />
          </Field>
        </>
      )}
      <Field label={de ? "Sonstige Werbungskosten (Arbeitsmittel etc.)?" : "Other work-related expenses?"}>
        <YesNo value={data.hatAusgaben} onChange={(v) => set("hatAusgaben", v)} yesLabel={de ? "Ja" : "Yes"} noLabel={de ? "Nein" : "No"} />
      </Field>
    </div>,

    // 4 — Insurance & family
    <div key="versicherung" className="space-y-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{de ? "Versicherungen" : "Insurance"}</p>
      <div className="space-y-2">
        <CheckRow checked={data.versicherungGesetzlich} onChange={(v) => set("versicherungGesetzlich", v)} label={de ? "Gesetzliche Krankenversicherung" : "Public health insurance"} />
        <CheckRow checked={data.versicherungPrivat} onChange={(v) => set("versicherungPrivat", v)} label={de ? "Private Krankenversicherung" : "Private health insurance"} />
        <CheckRow checked={data.versicherungAltersvorsorge} onChange={(v) => set("versicherungAltersvorsorge", v)} label={de ? "Private Altersvorsorge" : "Private pension"} />
        <CheckRow checked={data.versicherungKfz} onChange={(v) => set("versicherungKfz", v)} label={de ? "KFZ-Haftpflichtversicherung" : "Car liability insurance"} />
      </div>
      <Field label={de ? "Haben Sie Kinder?" : "Do you have children?"}>
        <YesNo value={data.hatKinder} onChange={(v) => set("hatKinder", v)} yesLabel={de ? "Ja" : "Yes"} noLabel={de ? "Nein" : "No"} />
      </Field>
      <Field label={de ? "Zahlen Sie Unterhalt?" : "Do you pay maintenance?"}>
        <YesNo value={data.zahltUnterhalt} onChange={(v) => set("zahltUnterhalt", v)} yesLabel={de ? "Ja" : "Yes"} noLabel={de ? "Nein" : "No"} />
      </Field>
      <Field label={de ? "Empfangen Sie Ausbildungsförderung?" : "Do you receive education support?"}>
        <YesNo value={data.hatAusbildungsfoerderung} onChange={(v) => set("hatAusbildungsfoerderung", v)} yesLabel={de ? "Ja" : "Yes"} noLabel={de ? "Nein" : "No"} />
      </Field>
      <Field label={de ? "Datum der Unterschrift (TT.MM.JJJJ)" : "Signature date (DD.MM.YYYY)"}>
        <Input value={data.datumUnterschrift} onChange={(v) => set("datumUnterschrift", v)} placeholder="01.06.2026" />
      </Field>
    </div>,

    // 5 — Download
    <div key="download" className="space-y-4">
      {downloadUrl ? (
        <>
          <div className="rounded-[1.2rem] bg-emerald-50 p-4 text-center">
            <p className="text-2xl">✅</p>
            <p className="mt-2 text-base font-bold text-emerald-800">
              {de ? "Anlage EK fertig!" : "Anlage EK ready!"}
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              {de ? "PDF herunterladen, ausdrucken und beim Jobcenter einreichen." : "Download the PDF, print it and submit to the Jobcenter."}
            </p>
          </div>
          <a href={downloadUrl} download="Anlage-EK.pdf"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 text-base font-bold text-white shadow-soft transition active:scale-[0.98]">
            ⬇ {de ? "Anlage EK herunterladen" : "Download Anlage EK"}
          </a>
          <button type="button" onClick={() => window.print()}
            className="flex min-h-12 w-full items-center justify-center rounded-full bg-trust-100 px-5 text-base font-bold text-trust-700 transition active:scale-[0.98]">
            🖨 {de ? "Als PDF drucken" : "Print as PDF"}
          </button>
        </>
      ) : (
        <>
          <div className="rounded-[1.2rem] bg-trust-50 p-4">
            <p className="text-sm font-semibold text-trust-800">
              {de ? "Alle Angaben werden direkt in das offizielle Formular eingetragen." : "All details are filled directly into the official form."}
            </p>
          </div>
          <button type="button" onClick={generate} disabled={loading}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-trust-500 px-5 text-base font-bold text-white shadow-soft transition active:scale-[0.98] disabled:opacity-70">
            {loading ? (de ? "Wird erstellt…" : "Generating…") : `📄 ${de ? "Anlage EK erstellen" : "Generate Anlage EK"}`}
          </button>
          {error && <p className="rounded-[1rem] bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
        </>
      )}
      <div className="rounded-[1.2rem] bg-amber-50 p-4">
        <p className="text-xs font-semibold leading-5 text-amber-900">
          {de ? "Bitte prüfe alle Angaben vor dem Einreichen. EinfachAmt übernimmt keine Haftung für Richtigkeit." : "Please check all details before submitting. EinfachAmt is not liable for accuracy."}
        </p>
      </div>
    </div>,
  ];

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>{STEPS[step]}</span>
          <span>{step + 1} / {TOTAL}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-trust-100">
          <div className="h-full rounded-full bg-trust-500 transition-all duration-300"
            style={{ width: `${((step + 1) / TOTAL) * 100}%` }} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-ink">{STEPS[step]}</h2>

      <div className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
        {stepContent[step]}
      </div>

      <div className="flex gap-3">
        {step > 0 && (
          <button type="button" onClick={() => setStep((s) => s - 1)}
            className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-slate-100 text-base font-bold text-slate-700 transition active:scale-[0.97]">
            ← {de ? "Zurück" : "Back"}
          </button>
        )}
        {step < TOTAL - 1 && (
          <button type="button" onClick={() => setStep((s) => s + 1)}
            className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-trust-500 text-base font-bold text-white shadow-sm transition active:scale-[0.97]">
            {step === TOTAL - 2 ? `📄 ${de ? "Zusammenfassung" : "Review"}` : `${de ? "Weiter" : "Next"} →`}
          </button>
        )}
      </div>
    </div>
  );
}
