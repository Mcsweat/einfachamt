"use client";

import { useState } from "react";
import { type Language } from "@/lib/i18n";
import { type AntragFormData } from "@/app/api/antrag/fill/route";
import { type AnlageEKData } from "@/app/api/antrag/fill-ek/route";

type Props = { language: Language };

// ── Combined form data ────────────────────────────────────────────────────

type BuergergeldData = {
  // Personal (HA + EK shared)
  vorname: string; nachname: string; gebName: string;
  gebDatum: string; gebOrt: string; gebLand: string;
  staat: string; gender: "m" | "w" | "d" | "k";
  // BG partner (EK)
  bgNr: string; bgVorname: string; bgNachname: string; bgGebDatum: string;
  // Address (HA)
  strasse: string; hausnr: string; plz: string; ort: string; tel: string;
  // Bank & IDs (HA)
  iban: string; kontoinhaber: string;
  rvStatus: "vorhanden" | "keine" | "beantragt"; rvNr: string; steurId: string;
  // Situation (HA)
  antragAb: "sofort" | "spaeter"; antragDatum: string;
  famstand: "ledig"|"verheiratet"|"verwitwet"|"eingetragen"|"getrennt"|"geschieden"|"aufgehoben";
  kvTyp: "gkv" | "pkv"; kvName: string;
  hatWohnkosten: boolean; mitbewohner: string[];
  // Income (EK)
  hatEinkommen: "ja" | "nein";
  ag1Name: string; ag1Str: string; ag1HausNr: string; ag1Plz: string; ag1Ort: string;
  einkommenMonat: boolean; einkommenFolgemonat: boolean;
  ag2Name: string; ag2Str: string; ag2HausNr: string; ag2Plz: string; ag2Ort: string;
  weitereMonat: boolean; weitereFolgemonat: boolean;
  istFreiberuflich: "ja" | "nein"; hatEhrenamt: "ja" | "nein";
  einnahmen: {
    wohngeld: boolean; arbeitslosengeld: boolean; krankengeld: boolean;
    uebergangsgeld: boolean; kurzarbeitergeld: boolean; insolvenzgeld: boolean;
    elterngeld: boolean; kindergeld: boolean; kinderzuschlag: boolean;
    unterhalt: boolean; unterhaltsvorschuss: boolean; bafög: boolean;
    bab: boolean; ausbildungsgeld: boolean; renten: boolean; vermietung: boolean;
    sozialhilfe: boolean; sachbezuege: boolean; digital: boolean;
    sonstige: boolean; sonstigeText: string; keine: boolean;
  };
  // Travel (EK)
  hatFahrtkosten: "ja" | "nein";
  arbeitsstaetteStr: string; arbeitsstaetteHausNr: string;
  arbeitsstaettePlz: string; arbeitsstaetteOrt: string;
  streckeKm: string; fahrtenProWoche: string;
  fahrtKfz: boolean; fahrtOeffis: boolean; fahrtSonstiges: boolean; fahrtSonstigesText: string;
  fahrkostenZuschuss: "ja" | "nein"; hatAusgaben: "ja" | "nein";
  // Insurance & family (EK)
  versicherungKfz: boolean; versicherungGesetzlich: boolean;
  versicherungAltersvorsorge: boolean; versicherungPrivat: boolean;
  hatKinder: "ja" | "nein"; zahltUnterhalt: "ja" | "nein";
  hatAusbildungsfoerderung: "ja" | "nein"; datumUnterschrift: string;
};

const EMPTY: BuergergeldData = {
  vorname: "", nachname: "", gebName: "", gebDatum: "", gebOrt: "", gebLand: "Deutschland",
  staat: "deutsch", gender: "m",
  bgNr: "", bgVorname: "", bgNachname: "", bgGebDatum: "",
  strasse: "", hausnr: "", plz: "", ort: "", tel: "",
  iban: "", kontoinhaber: "", rvStatus: "vorhanden", rvNr: "", steurId: "",
  antragAb: "sofort", antragDatum: "",
  famstand: "ledig", kvTyp: "gkv", kvName: "", hatWohnkosten: true, mitbewohner: [],
  hatEinkommen: "nein",
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
  versicherungGesetzlich: true, versicherungPrivat: false,
  versicherungAltersvorsorge: false, versicherungKfz: false,
  hatKinder: "nein", zahltUnterhalt: "nein", hatAusbildungsfoerderung: "nein",
  datumUnterschrift: "",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function toHaData(d: BuergergeldData): AntragFormData {
  return {
    vorname: d.vorname, nachname: d.nachname, gebName: d.gebName,
    gebDatum: d.gebDatum, gebOrt: d.gebOrt, gebLand: d.gebLand,
    staat: d.staat, gender: d.gender,
    strasse: d.strasse, hausnr: d.hausnr, plz: d.plz, ort: d.ort, tel: d.tel,
    iban: d.iban, kontoinhaber: d.kontoinhaber,
    rvStatus: d.rvStatus, rvNr: d.rvNr, steurId: d.steurId,
    antragAb: d.antragAb, antragDatum: d.antragDatum,
    famstand: d.famstand, kvTyp: d.kvTyp, kvName: d.kvName,
    hatWohnkosten: d.hatWohnkosten, mitbewohner: d.mitbewohner,
  };
}

function toEkData(d: BuergergeldData): AnlageEKData {
  return {
    vorname: d.vorname, nachname: d.nachname, gebDatum: d.gebDatum, bgNr: d.bgNr,
    bgVorname: d.bgVorname, bgNachname: d.bgNachname, bgGebDatum: d.bgGebDatum,
    hatEinkommen: d.hatEinkommen,
    ag1Name: d.ag1Name, ag1Str: d.ag1Str, ag1HausNr: d.ag1HausNr, ag1Plz: d.ag1Plz, ag1Ort: d.ag1Ort,
    einkommenMonat: d.einkommenMonat, einkommenFolgemonat: d.einkommenFolgemonat,
    ag2Name: d.ag2Name, ag2Str: d.ag2Str, ag2HausNr: d.ag2HausNr, ag2Plz: d.ag2Plz, ag2Ort: d.ag2Ort,
    weitereMonat: d.weitereMonat, weitereFolgemonat: d.weitereFolgemonat,
    istFreiberuflich: d.istFreiberuflich, hatEhrenamt: d.hatEhrenamt,
    einnahmen: d.einnahmen,
    hatFahrtkosten: d.hatFahrtkosten,
    arbeitsstaetteStr: d.arbeitsstaetteStr, arbeitsstaetteHausNr: d.arbeitsstaetteHausNr,
    arbeitsstaettePlz: d.arbeitsstaettePlz, arbeitsstaetteOrt: d.arbeitsstaetteOrt,
    streckeKm: d.streckeKm, fahrtenProWoche: d.fahrtenProWoche,
    fahrtKfz: d.fahrtKfz, fahrtOeffis: d.fahrtOeffis,
    fahrtSonstiges: d.fahrtSonstiges, fahrtSonstigesText: d.fahrtSonstigesText,
    fahrkostenZuschuss: d.fahrkostenZuschuss, hatAusgaben: d.hatAusgaben,
    versicherungKfz: d.versicherungKfz, versicherungGesetzlich: d.versicherungGesetzlich,
    versicherungAltersvorsorge: d.versicherungAltersvorsorge, versicherungPrivat: d.versicherungPrivat,
    hatKinder: d.hatKinder, zahltUnterhalt: d.zahltUnterhalt,
    hatAusbildungsfoerderung: d.hatAusbildungsfoerderung,
    datumUnterschrift: d.datumUnterschrift,
  };
}

// ── UI components ──────────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-slate-600">{label}</label>
      {hint && <p className="mb-1.5 text-xs text-slate-400">{hint}</p>}
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
function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: [string, string][];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-[0.9rem] border border-slate-200 bg-white px-4 py-3 text-base text-ink outline-none focus:border-trust-500 focus:ring-2 focus:ring-trust-200">
      {options.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
    </select>
  );
}
function Pills({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: [string, string][];
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map(([val, label]) => (
        <button key={val} type="button" onClick={() => onChange(val)}
          className={`rounded-[0.9rem] px-3 py-3 text-sm font-bold transition active:scale-[0.97] ${value === val ? "bg-trust-500 text-white" : "bg-slate-100 text-slate-700"}`}>
          {label}
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
function MultiCheck({ selected, onChange, options }: {
  selected: string[]; onChange: (v: string[]) => void; options: [string, string][];
}) {
  function toggle(val: string) {
    onChange(selected.includes(val) ? selected.filter((x) => x !== val) : [...selected, val]);
  }
  return (
    <div className="space-y-2">
      {options.map(([val, label]) => (
        <button key={val} type="button" onClick={() => toggle(val)}
          className={`flex w-full items-center gap-3 rounded-[0.9rem] px-4 py-3 text-sm font-semibold transition active:scale-[0.97] ${selected.includes(val) ? "bg-trust-50 text-trust-700 ring-2 ring-trust-300" : "bg-slate-50 text-slate-700"}`}>
          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black ${selected.includes(val) ? "border-trust-500 bg-trust-500 text-white" : "border-slate-300"}`}>
            {selected.includes(val) ? "✓" : ""}
          </span>
          {label}
        </button>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{children}</p>;
}

// ── Wizard ─────────────────────────────────────────────────────────────────

export function BuergergeldWizard({ language }: Props) {
  const de = language === "de";
  const [data, setData] = useState<BuergergeldData>(EMPTY);
  const [stepIdx, setStepIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloads, setDownloads] = useState<{ ha: string | null; ek: string | null }>({ ha: null, ek: null });

  function set<K extends keyof BuergergeldData>(key: K, value: BuergergeldData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }
  function setIncome(key: keyof BuergergeldData["einnahmen"], value: boolean | string) {
    setData((prev) => ({ ...prev, einnahmen: { ...prev.einnahmen, [key]: value } }));
  }

  // ── Step definitions ─────────────────────────────────────────────────────

  type StepDef = { id: string; label: string; show: boolean; content: React.ReactNode };

  const incomeCheckboxes: { key: keyof BuergergeldData["einnahmen"]; de: string; en: string }[] = [
    { key: "arbeitslosengeld", de: "Arbeitslosengeld I / II", en: "Unemployment benefit" },
    { key: "krankengeld", de: "Krankengeld", en: "Sick pay" },
    { key: "elterngeld", de: "Elterngeld", en: "Parental allowance" },
    { key: "kindergeld", de: "Kindergeld", en: "Child benefit" },
    { key: "kinderzuschlag", de: "Kinderzuschlag", en: "Child supplement" },
    { key: "unterhalt", de: "Unterhalt (empfangen)", en: "Maintenance received" },
    { key: "unterhaltsvorschuss", de: "Unterhaltsvorschuss", en: "Maintenance advance" },
    { key: "wohngeld", de: "Wohngeld", en: "Housing benefit" },
    { key: "renten", de: "Rente / Pension", en: "Pension" },
    { key: "bafög", de: "BAföG", en: "BAföG grant" },
    { key: "bab", de: "BAB", en: "Training allowance (BAB)" },
    { key: "ausbildungsgeld", de: "Ausbildungsgeld", en: "Vocational training pay" },
    { key: "kurzarbeitergeld", de: "Kurzarbeitergeld", en: "Short-time work pay" },
    { key: "insolvenzgeld", de: "Insolvenzgeld", en: "Insolvency benefit" },
    { key: "uebergangsgeld", de: "Übergangsgeld", en: "Transitional benefit" },
    { key: "vermietung", de: "Vermietung / Verpachtung", en: "Rental income" },
    { key: "sozialhilfe", de: "Sozialhilfe", en: "Social assistance" },
    { key: "sachbezuege", de: "Sachbezüge", en: "Benefits in kind" },
    { key: "digital", de: "Digitale Einnahmen", en: "Digital income" },
    { key: "sonstige", de: "Sonstige", en: "Other" },
  ];

  const STEPS: StepDef[] = [
    {
      id: "person", show: true,
      label: de ? "Persönliche Daten" : "Personal details",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label={de ? "Vorname" : "First name"}>
              <Input value={data.vorname} onChange={(v) => set("vorname", v)} placeholder="Max" />
            </Field>
            <Field label={de ? "Nachname" : "Last name"}>
              <Input value={data.nachname} onChange={(v) => set("nachname", v)} placeholder="Mustermann" />
            </Field>
          </div>
          <Field label={de ? "Geburtsname (falls abweichend)" : "Birth name (if different)"}>
            <Input value={data.gebName} onChange={(v) => set("gebName", v)} placeholder={de ? "optional" : "optional"} />
          </Field>
          <Field label={de ? "Geburtsdatum (TT.MM.JJJJ)" : "Date of birth (DD.MM.YYYY)"}>
            <Input value={data.gebDatum} onChange={(v) => set("gebDatum", v)} placeholder="01.01.1990" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={de ? "Geburtsort" : "Birthplace"}>
              <Input value={data.gebOrt} onChange={(v) => set("gebOrt", v)} placeholder="Berlin" />
            </Field>
            <Field label={de ? "Geburtsland" : "Birth country"}>
              <Input value={data.gebLand} onChange={(v) => set("gebLand", v)} placeholder="Deutschland" />
            </Field>
          </div>
          <Field label={de ? "Staatsangehörigkeit" : "Nationality"}>
            <Input value={data.staat} onChange={(v) => set("staat", v)} placeholder="deutsch" />
          </Field>
          <Field label={de ? "Geschlecht" : "Gender"}>
            <Pills value={data.gender} onChange={(v) => set("gender", v as BuergergeldData["gender"])}
              options={de
                ? [["m","Männlich"],["w","Weiblich"],["d","Divers"],["k","Keine Angabe"]]
                : [["m","Male"],["w","Female"],["d","Diverse"],["k","Not stated"]]} />
          </Field>
          <SectionLabel>{de ? "Partner/in in der Bedarfsgemeinschaft (optional)" : "Partner in household (optional)"}</SectionLabel>
          <Field label={de ? "BG-Nummer" : "BG number"}>
            <Input value={data.bgNr} onChange={(v) => set("bgNr", v)} placeholder="12345678" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={de ? "Vorname" : "First name"}>
              <Input value={data.bgVorname} onChange={(v) => set("bgVorname", v)} placeholder="Anna" />
            </Field>
            <Field label={de ? "Nachname" : "Last name"}>
              <Input value={data.bgNachname} onChange={(v) => set("bgNachname", v)} placeholder="Muster" />
            </Field>
          </div>
          <Field label={de ? "Geburtsdatum Partner/in" : "Partner date of birth"}>
            <Input value={data.bgGebDatum} onChange={(v) => set("bgGebDatum", v)} placeholder="15.06.1987" />
          </Field>
        </div>
      ),
    },
    {
      id: "address", show: true,
      label: de ? "Adresse & Kontakt" : "Address & contact",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-[1fr_80px] gap-3">
            <Field label={de ? "Straße" : "Street"}>
              <Input value={data.strasse} onChange={(v) => set("strasse", v)} placeholder="Musterstraße" />
            </Field>
            <Field label="Nr.">
              <Input value={data.hausnr} onChange={(v) => set("hausnr", v)} placeholder="12a" />
            </Field>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-3">
            <Field label="PLZ">
              <Input value={data.plz} onChange={(v) => set("plz", v)} placeholder="10115" />
            </Field>
            <Field label={de ? "Ort" : "City"}>
              <Input value={data.ort} onChange={(v) => set("ort", v)} placeholder="Berlin" />
            </Field>
          </div>
          <Field label={de ? "Telefon (optional)" : "Phone (optional)"}>
            <Input value={data.tel} onChange={(v) => set("tel", v)} type="tel" placeholder="+49 170 123 4567" />
          </Field>
        </div>
      ),
    },
    {
      id: "bank", show: true,
      label: de ? "Bank & Ausweise" : "Bank & IDs",
      content: (
        <div className="space-y-4">
          <Field label="IBAN" hint={de ? "Konto für Auszahlung" : "Account for payment"}>
            <Input value={data.iban} onChange={(v) => set("iban", v)} placeholder="DE89 3704 0044 0532 0130 00" />
          </Field>
          <Field label={de ? "Kontoinhaber" : "Account holder"}>
            <Input value={data.kontoinhaber} onChange={(v) => set("kontoinhaber", v)} placeholder="Max Mustermann" />
          </Field>
          <Field label={de ? "Rentenversicherung" : "Pension insurance"}>
            <Pills value={data.rvStatus} onChange={(v) => set("rvStatus", v as BuergergeldData["rvStatus"])}
              options={de
                ? [["vorhanden","Vorhanden"],["keine","Keine"],["beantragt","Beantragt"]]
                : [["vorhanden","Have one"],["keine","None"],["beantragt","Applied"]]} />
          </Field>
          {data.rvStatus === "vorhanden" && (
            <Field label={de ? "Rentenversicherungsnummer" : "Pension insurance number"}>
              <Input value={data.rvNr} onChange={(v) => set("rvNr", v)} placeholder="A 123456789" />
            </Field>
          )}
          <Field label={de ? "Steuer-Identifikationsnummer" : "Tax identification number"}>
            <Input value={data.steurId} onChange={(v) => set("steurId", v)} placeholder="12 345 678 901" />
          </Field>
        </div>
      ),
    },
    {
      id: "situation", show: true,
      label: de ? "Ihre Situation" : "Your situation",
      content: (
        <div className="space-y-4">
          <Field label={de ? "Antrag ab wann?" : "Benefit start date?"}>
            <Pills value={data.antragAb} onChange={(v) => set("antragAb", v as BuergergeldData["antragAb"])}
              options={de ? [["sofort","Ab sofort"],["spaeter","Später"]] : [["sofort","From now"],["spaeter","Later"]]} />
          </Field>
          {data.antragAb === "spaeter" && (
            <Field label={de ? "Ab welchem Datum?" : "From which date?"}>
              <Input value={data.antragDatum} onChange={(v) => set("antragDatum", v)} placeholder="01.01.2025" />
            </Field>
          )}
          <Field label={de ? "Familienstand" : "Marital status"}>
            <Select value={data.famstand} onChange={(v) => set("famstand", v as BuergergeldData["famstand"])}
              options={de
                ? [["ledig","Ledig"],["verheiratet","Verheiratet"],["verwitwet","Verwitwet"],["eingetragen","Eingetragene Lebenspartnerschaft"],["getrennt","Getrennt lebend"],["geschieden","Geschieden"],["aufgehoben","Aufgehoben"]]
                : [["ledig","Single"],["verheiratet","Married"],["verwitwet","Widowed"],["eingetragen","Civil partnership"],["getrennt","Separated"],["geschieden","Divorced"],["aufgehoben","Dissolved"]]} />
          </Field>
          <Field label={de ? "Krankenkasse" : "Health insurance type"}>
            <Pills value={data.kvTyp} onChange={(v) => set("kvTyp", v as BuergergeldData["kvTyp"])}
              options={de ? [["gkv","Gesetzlich (GKV)"],["pkv","Privat (PKV)"]] : [["gkv","Public (GKV)"],["pkv","Private (PKV)"]]} />
          </Field>
          <Field label={de ? "Name der Krankenkasse" : "Health insurance provider"}>
            <Input value={data.kvName} onChange={(v) => set("kvName", v)} placeholder="AOK / TK / Barmer …" />
          </Field>
          <Field label={de ? "Haben Sie Wohnkosten (Miete)?" : "Do you pay rent / housing costs?"}>
            <Pills value={data.hatWohnkosten ? "ja" : "nein"} onChange={(v) => set("hatWohnkosten", v === "ja")}
              options={de ? [["ja","Ja"],["nein","Nein"]] : [["ja","Yes"],["nein","No"]]} />
          </Field>
          <Field label={de ? "Wer lebt noch im Haushalt?" : "Who else lives in your household?"}>
            <MultiCheck selected={data.mitbewohner} onChange={(v) => set("mitbewohner", v)}
              options={de
                ? [["ehegatte","Ehegatte / Partner"],["kind","Kind (15+)"],["kindU15","Kind (unter 15)"],["eltern","Eltern"],["verwandte","Verwandte"],["sonstige","Sonstige"]]
                : [["ehegatte","Spouse / partner"],["kind","Child (15+)"],["kindU15","Child (under 15)"],["eltern","Parents"],["verwandte","Relatives"],["sonstige","Other"]]} />
          </Field>
        </div>
      ),
    },
    {
      id: "einkommen-ja-nein", show: true,
      label: de ? "Einkommen" : "Income",
      content: (
        <div className="space-y-4">
          <p className="text-base leading-7 text-slate-600">
            {de ? "Haben Sie aktuell Einnahmen aus Arbeit, Rente, Unterhalt oder anderen Quellen?" : "Do you currently have income from work, pension, maintenance or other sources?"}
          </p>
          <Pills value={data.hatEinkommen} onChange={(v) => set("hatEinkommen", v as "ja" | "nein")}
            options={de ? [["ja","Ja, ich habe Einkommen"],["nein","Nein, kein Einkommen"]] : [["ja","Yes, I have income"],["nein","No income"]]} />
          {data.hatEinkommen === "nein" && (
            <div className="rounded-[1rem] bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                {de ? "✓ Kein Einkommen — wir überspringen die Einkommens-Fragen." : "✓ No income — we'll skip the income questions."}
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "arbeitgeber", show: data.hatEinkommen === "ja",
      label: de ? "Arbeitgeber" : "Employer",
      content: (
        <div className="space-y-4">
          <SectionLabel>{de ? "Arbeitgeber 1" : "Employer 1"}</SectionLabel>
          <Field label={de ? "Name des Arbeitgebers" : "Employer name"}>
            <Input value={data.ag1Name} onChange={(v) => set("ag1Name", v)} placeholder="Musterfirma GmbH" />
          </Field>
          <div className="grid grid-cols-[1fr_80px] gap-3">
            <Field label={de ? "Straße" : "Street"}>
              <Input value={data.ag1Str} onChange={(v) => set("ag1Str", v)} placeholder="Musterstraße" />
            </Field>
            <Field label="Nr.">
              <Input value={data.ag1HausNr} onChange={(v) => set("ag1HausNr", v)} placeholder="5" />
            </Field>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-3">
            <Field label="PLZ"><Input value={data.ag1Plz} onChange={(v) => set("ag1Plz", v)} placeholder="60311" /></Field>
            <Field label={de ? "Ort" : "City"}><Input value={data.ag1Ort} onChange={(v) => set("ag1Ort", v)} placeholder="Frankfurt" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <CheckRow checked={data.einkommenMonat} onChange={(v) => set("einkommenMonat", v)} label={de ? "Diesen Monat" : "This month"} />
            <CheckRow checked={data.einkommenFolgemonat} onChange={(v) => set("einkommenFolgemonat", v)} label={de ? "Folgemonat" : "Next month"} />
          </div>
          <SectionLabel>{de ? "Arbeitgeber 2 (optional)" : "Employer 2 (optional)"}</SectionLabel>
          <Field label={de ? "Name" : "Name"}>
            <Input value={data.ag2Name} onChange={(v) => set("ag2Name", v)} placeholder={de ? "Falls vorhanden" : "If applicable"} />
          </Field>
          <div className="grid grid-cols-[1fr_80px] gap-3">
            <Field label={de ? "Straße" : "Street"}><Input value={data.ag2Str} onChange={(v) => set("ag2Str", v)} /></Field>
            <Field label="Nr."><Input value={data.ag2HausNr} onChange={(v) => set("ag2HausNr", v)} /></Field>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-3">
            <Field label="PLZ"><Input value={data.ag2Plz} onChange={(v) => set("ag2Plz", v)} /></Field>
            <Field label={de ? "Ort" : "City"}><Input value={data.ag2Ort} onChange={(v) => set("ag2Ort", v)} /></Field>
          </div>
          <Field label={de ? "Selbstständig / freiberuflich?" : "Self-employed / freelance?"}>
            <Pills value={data.istFreiberuflich} onChange={(v) => set("istFreiberuflich", v as "ja"|"nein")}
              options={de ? [["ja","Ja"],["nein","Nein"]] : [["ja","Yes"],["nein","No"]]} />
          </Field>
          <Field label={de ? "Ehrenamtliche Aufwandsentschädigung?" : "Volunteer allowance?"}>
            <Pills value={data.hatEhrenamt} onChange={(v) => set("hatEhrenamt", v as "ja"|"nein")}
              options={de ? [["ja","Ja"],["nein","Nein"]] : [["ja","Yes"],["nein","No"]]} />
          </Field>
        </div>
      ),
    },
    {
      id: "einnahmen", show: data.hatEinkommen === "ja",
      label: de ? "Einkommensarten" : "Income types",
      content: (
        <div className="space-y-2">
          <p className="text-sm text-slate-500">{de ? "Alles auswählen, was zutrifft:" : "Select all that apply:"}</p>
          {incomeCheckboxes.map(({ key, de: deLbl, en: enLbl }) => (
            <CheckRow key={key} checked={data.einnahmen[key] as boolean}
              onChange={(v) => setIncome(key, v)} label={de ? deLbl : enLbl} />
          ))}
          {data.einnahmen.sonstige && (
            <Field label={de ? "Sonstige Einnahmen (beschreiben)" : "Describe other income"}>
              <Input value={data.einnahmen.sonstigeText} onChange={(v) => setIncome("sonstigeText", v)} placeholder={de ? "z.B. Erbschaft" : "e.g. inheritance"} />
            </Field>
          )}
          <CheckRow checked={data.einnahmen.keine} onChange={(v) => setIncome("keine", v)} label={de ? "Keine weiteren Einnahmen" : "No further income"} />
        </div>
      ),
    },
    {
      id: "fahrt", show: data.hatEinkommen === "ja",
      label: de ? "Fahrtkosten & Ausgaben" : "Travel & expenses",
      content: (
        <div className="space-y-4">
          <Field label={de ? "Haben Sie Fahrtkosten zur Arbeit?" : "Do you have commuting costs?"}>
            <Pills value={data.hatFahrtkosten} onChange={(v) => set("hatFahrtkosten", v as "ja"|"nein")}
              options={de ? [["ja","Ja"],["nein","Nein"]] : [["ja","Yes"],["nein","No"]]} />
          </Field>
          {data.hatFahrtkosten === "ja" && (
            <>
              <SectionLabel>{de ? "Adresse der Arbeitsstätte" : "Workplace address"}</SectionLabel>
              <div className="grid grid-cols-[1fr_80px] gap-3">
                <Field label={de ? "Straße" : "Street"}><Input value={data.arbeitsstaetteStr} onChange={(v) => set("arbeitsstaetteStr", v)} placeholder="Arbeitsweg 1" /></Field>
                <Field label="Nr."><Input value={data.arbeitsstaetteHausNr} onChange={(v) => set("arbeitsstaetteHausNr", v)} placeholder="1" /></Field>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-3">
                <Field label="PLZ"><Input value={data.arbeitsstaettePlz} onChange={(v) => set("arbeitsstaettePlz", v)} placeholder="60311" /></Field>
                <Field label={de ? "Ort" : "City"}><Input value={data.arbeitsstaetteOrt} onChange={(v) => set("arbeitsstaetteOrt", v)} placeholder="Frankfurt" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label={de ? "Strecke (km)" : "Distance (km)"}><Input value={data.streckeKm} onChange={(v) => set("streckeKm", v)} placeholder="12" type="number" /></Field>
                <Field label={de ? "Fahrten/Woche" : "Trips/week"}><Input value={data.fahrtenProWoche} onChange={(v) => set("fahrtenProWoche", v)} placeholder="5" type="number" /></Field>
              </div>
              <SectionLabel>{de ? "Verkehrsmittel" : "Transport type"}</SectionLabel>
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
              <Field label={de ? "Arbeitgeber erstattet Fahrtkosten?" : "Employer reimburses travel costs?"}>
                <Pills value={data.fahrkostenZuschuss} onChange={(v) => set("fahrkostenZuschuss", v as "ja"|"nein")}
                  options={de ? [["ja","Ja"],["nein","Nein"]] : [["ja","Yes"],["nein","No"]]} />
              </Field>
            </>
          )}
          <Field label={de ? "Weitere Werbungskosten (Arbeitsmittel etc.)?" : "Other work-related expenses?"}>
            <Pills value={data.hatAusgaben} onChange={(v) => set("hatAusgaben", v as "ja"|"nein")}
              options={de ? [["ja","Ja"],["nein","Nein"]] : [["ja","Yes"],["nein","No"]]} />
          </Field>
        </div>
      ),
    },
    {
      id: "versicherung", show: true,
      label: de ? "Versicherung & Familie" : "Insurance & family",
      content: (
        <div className="space-y-4">
          <SectionLabel>{de ? "Welche Versicherungen haben Sie?" : "Which insurance do you have?"}</SectionLabel>
          <div className="space-y-2">
            <CheckRow checked={data.versicherungGesetzlich} onChange={(v) => set("versicherungGesetzlich", v)} label={de ? "Gesetzliche Krankenversicherung" : "Public health insurance"} />
            <CheckRow checked={data.versicherungPrivat} onChange={(v) => set("versicherungPrivat", v)} label={de ? "Private Krankenversicherung" : "Private health insurance"} />
            <CheckRow checked={data.versicherungAltersvorsorge} onChange={(v) => set("versicherungAltersvorsorge", v)} label={de ? "Private Altersvorsorge" : "Private pension plan"} />
            <CheckRow checked={data.versicherungKfz} onChange={(v) => set("versicherungKfz", v)} label={de ? "KFZ-Haftpflichtversicherung" : "Car liability insurance"} />
          </div>
          <Field label={de ? "Haben Sie Kinder?" : "Do you have children?"}>
            <Pills value={data.hatKinder} onChange={(v) => set("hatKinder", v as "ja"|"nein")}
              options={de ? [["ja","Ja"],["nein","Nein"]] : [["ja","Yes"],["nein","No"]]} />
          </Field>
          <Field label={de ? "Zahlen Sie Unterhalt?" : "Do you pay maintenance?"}>
            <Pills value={data.zahltUnterhalt} onChange={(v) => set("zahltUnterhalt", v as "ja"|"nein")}
              options={de ? [["ja","Ja"],["nein","Nein"]] : [["ja","Yes"],["nein","No"]]} />
          </Field>
          <Field label={de ? "Empfangen Sie Ausbildungsförderung?" : "Do you receive education support?"}>
            <Pills value={data.hatAusbildungsfoerderung} onChange={(v) => set("hatAusbildungsfoerderung", v as "ja"|"nein")}
              options={de ? [["ja","Ja"],["nein","Nein"]] : [["ja","Yes"],["nein","No"]]} />
          </Field>
          <Field label={de ? "Datum der Unterschrift (TT.MM.JJJJ)" : "Signature date (DD.MM.YYYY)"}>
            <Input value={data.datumUnterschrift} onChange={(v) => set("datumUnterschrift", v)} placeholder="01.06.2026" />
          </Field>
        </div>
      ),
    },
    {
      id: "download", show: true,
      label: de ? "Fertig — PDFs erstellen" : "Done — generate PDFs",
      content: null, // rendered separately below
    },
  ];

  const visibleSteps = STEPS.filter((s) => s.show);
  const currentStep = visibleSteps[stepIdx];
  const TOTAL = visibleSteps.length;
  const isLastStep = stepIdx === TOTAL - 1;

  // ── Generate both PDFs ──────────────────────────────────────────────────

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const [haRes, ekRes] = await Promise.all([
        fetch("/api/antrag/fill", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(toHaData(data)) }),
        fetch("/api/antrag/fill-ek", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(toEkData(data)) }),
      ]);
      if (!haRes.ok) {
        const j = await haRes.json().catch(() => ({})) as { error?: string };
        throw new Error(j.error ?? "Fehler beim Hauptantrag.");
      }
      if (!ekRes.ok) {
        const j = await ekRes.json().catch(() => ({})) as { error?: string };
        throw new Error(j.error ?? "Fehler bei Anlage EK.");
      }
      const [haBlob, ekBlob] = await Promise.all([haRes.blob(), ekRes.blob()]);
      setDownloads({ ha: URL.createObjectURL(haBlob), ek: URL.createObjectURL(ekBlob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fehler");
    } finally {
      setLoading(false);
    }
  }

  const downloadStep = (
    <div className="space-y-4">
      {/* Summary */}
      <div className="rounded-[1.2rem] bg-slate-50 p-4 space-y-1 text-sm text-slate-700">
        <p><span className="font-bold">{de ? "Name:" : "Name:"}</span> {data.vorname} {data.nachname}</p>
        <p><span className="font-bold">{de ? "Geburtsdatum:" : "DOB:"}</span> {data.gebDatum}</p>
        <p><span className="font-bold">{de ? "Adresse:" : "Address:"}</span> {data.strasse} {data.hausnr}, {data.plz} {data.ort}</p>
        <p><span className="font-bold">IBAN:</span> {data.iban || "—"}</p>
        <p><span className="font-bold">{de ? "Einkommen:" : "Income:"}</span> {data.hatEinkommen === "ja" ? (de ? "Ja" : "Yes") : (de ? "Nein" : "No")}</p>
      </div>

      {downloads.ha && downloads.ek ? (
        <>
          <div className="rounded-[1.2rem] bg-emerald-50 p-4 text-center">
            <p className="text-2xl">✅</p>
            <p className="mt-1 text-base font-bold text-emerald-800">
              {de ? "Beide PDFs sind fertig!" : "Both PDFs are ready!"}
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              {de ? "Herunterladen, ausdrucken und beim Jobcenter einreichen." : "Download, print and submit to the Jobcenter."}
            </p>
          </div>
          <a href={downloads.ha} download="Hauptantrag-HA.pdf"
            className="flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-trust-500 px-5 py-3.5 text-base font-bold text-white shadow-soft transition active:scale-[0.98]">
            ⬇ {de ? "Hauptantrag (HA) herunterladen" : "Download main application (HA)"}
          </a>
          <a href={downloads.ek} download="Anlage-EK.pdf"
            className="flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3.5 text-base font-bold text-white shadow-soft transition active:scale-[0.98]">
            ⬇ {de ? "Anlage EK (Einkommen) herunterladen" : "Download Annex EK (income)"}
          </a>
          <button type="button" onClick={() => window.print()}
            className="flex min-h-12 w-full items-center justify-center rounded-full bg-trust-100 px-5 text-base font-bold text-trust-700 transition active:scale-[0.98]">
            🖨 {de ? "Drucken / Als PDF speichern" : "Print / Save as PDF"}
          </button>
        </>
      ) : (
        <button type="button" onClick={generate} disabled={loading}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-trust-500 px-5 text-lg font-bold text-white shadow-soft transition active:scale-[0.98] disabled:opacity-70">
          {loading
            ? (de ? "PDFs werden erstellt…" : "Generating PDFs…")
            : `📄 ${de ? "Beide PDFs erstellen" : "Generate both PDFs"}`}
        </button>
      )}

      {error && <p className="rounded-[1rem] bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}

      <div className="rounded-[1.2rem] bg-amber-50 p-4">
        <p className="text-xs font-semibold leading-5 text-amber-900">
          {de
            ? "Bitte prüfe alle Angaben vor dem Einreichen. EinfachAmt bietet keine Rechtsberatung und übernimmt keine Haftung für die Richtigkeit."
            : "Please check all details before submitting. EinfachAmt does not provide legal advice and accepts no liability for accuracy."}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>{currentStep.label}</span>
          <span>{stepIdx + 1} / {TOTAL}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-trust-100">
          <div className="h-full rounded-full bg-trust-500 transition-all duration-300"
            style={{ width: `${((stepIdx + 1) / TOTAL) * 100}%` }} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-ink">{currentStep.label}</h2>

      <div className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
        {isLastStep ? downloadStep : currentStep.content}
      </div>

      <div className="flex gap-3">
        {stepIdx > 0 && (
          <button type="button" onClick={() => setStepIdx((s) => s - 1)}
            className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-slate-100 text-base font-bold text-slate-700 transition active:scale-[0.97]">
            ← {de ? "Zurück" : "Back"}
          </button>
        )}
        {!isLastStep && (
          <button type="button" onClick={() => setStepIdx((s) => s + 1)}
            className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-trust-500 text-base font-bold text-white shadow-sm transition active:scale-[0.97]">
            {stepIdx === TOTAL - 2 ? `📋 ${de ? "Zusammenfassung" : "Review"}` : `${de ? "Weiter" : "Next"} →`}
          </button>
        )}
      </div>
    </div>
  );
}
