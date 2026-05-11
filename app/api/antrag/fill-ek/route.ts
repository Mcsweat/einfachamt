import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";
import { createClient } from "@/lib/supabase/server";
import { getSafeUser } from "@/lib/supabase/safe-auth";

export type AnlageEKData = {
  // Person
  vorname: string;
  nachname: string;
  gebDatum: string;
  bgNr: string;
  // BG partner (optional)
  bgVorname: string;
  bgNachname: string;
  bgGebDatum: string;
  hatEinkommen: "ja" | "nein";
  // Employer 1
  ag1Name: string;
  ag1Str: string;
  ag1HausNr: string;
  ag1Plz: string;
  ag1Ort: string;
  einkommenMonat: boolean;
  einkommenFolgemonat: boolean;
  // Employer 2
  ag2Name: string;
  ag2Str: string;
  ag2HausNr: string;
  ag2Plz: string;
  ag2Ort: string;
  weitereMonat: boolean;
  weitereFolgemonat: boolean;
  // Income types (checkboxes)
  istFreiberuflich: "ja" | "nein";
  hatEhrenamt: "ja" | "nein";
  einnahmen: {
    wohngeld: boolean;
    arbeitslosengeld: boolean;
    krankengeld: boolean;
    uebergangsgeld: boolean;
    kurzarbeitergeld: boolean;
    insolvenzgeld: boolean;
    elterngeld: boolean;
    kindergeld: boolean;
    kinderzuschlag: boolean;
    unterhalt: boolean;
    unterhaltsvorschuss: boolean;
    bafög: boolean;
    bab: boolean;
    ausbildungsgeld: boolean;
    renten: boolean;
    vermietung: boolean;
    sozialhilfe: boolean;
    sachbezuege: boolean;
    digital: boolean;
    sonstige: boolean;
    sonstigeText: string;
    keine: boolean;
  };
  // Travel
  hatFahrtkosten: "ja" | "nein";
  arbeitsstaetteStr: string;
  arbeitsstaetteHausNr: string;
  arbeitsstaettePlz: string;
  arbeitsstaetteOrt: string;
  streckeKm: string;
  fahrtenProWoche: string;
  fahrtKfz: boolean;
  fahrtOeffis: boolean;
  fahrtSonstiges: boolean;
  fahrtSonstigesText: string;
  fahrkostenZuschuss: "ja" | "nein";
  hatAusgaben: "ja" | "nein";
  // Insurance
  versicherungKfz: boolean;
  versicherungGesetzlich: boolean;
  versicherungAltersvorsorge: boolean;
  versicherungPrivat: boolean;
  // Family
  hatKinder: "ja" | "nein";
  zahltUnterhalt: "ja" | "nein";
  hatAusbildungsfoerderung: "ja" | "nein";
  // Signature
  datumUnterschrift: string;
};

function setText(form: ReturnType<PDFDocument["getForm"]>, name: string, value: string) {
  try { form.getTextField(name).setText(value || ""); } catch {}
}
function checkBox(form: ReturnType<PDFDocument["getForm"]>, name: string, checked: boolean) {
  try {
    const cb = form.getCheckBox(name);
    if (checked) cb.check(); else cb.uncheck();
  } catch {}
}
function setRadio(form: ReturnType<PDFDocument["getForm"]>, name: string, jaValue: string, neinValue: string, value: "ja" | "nein") {
  try {
    form.getRadioGroup(name).select(value === "ja" ? jaValue : neinValue);
  } catch {}
}

export async function POST(req: Request) {
  // Auth gate — antrag subscription required
  const user = await getSafeUser();
  if (!user || user.is_anonymous) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("antrag_subscription_status, subscription_status")
    .eq("id", user.id)
    .single();
  const hasAccess =
    profile?.antrag_subscription_status === "active" ||
    profile?.subscription_status === "active";
  if (!hasAccess) {
    return NextResponse.json({ error: "Kein aktives Abonnement." }, { status: 403 });
  }

  const data: AnlageEKData = await req.json();

  const templatePath = path.join(process.cwd(), "public", "templates", "anlage-ek.pdf");
  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  // Page 1 — Person
  setText(form, "txtfPersonVorname", data.vorname);
  setText(form, "txtfPersonNachname", data.nachname);
  setText(form, "datePersonGebDatum", data.gebDatum);
  setText(form, "txtfBGNr", data.bgNr);
  setText(form, "txtfBGVorname", data.bgVorname);
  setText(form, "txtfBGNachname", data.bgNachname);
  setText(form, "dateBGGebDatum", data.bgGebDatum);
  setRadio(form, "rbtnEinkommen", "/0", "/1", data.hatEinkommen);

  // Page 2 — Employers
  setText(form, "txtfAGName", data.ag1Name);
  setText(form, "txtfAGStr", data.ag1Str);
  setText(form, "txtfAGHausNr", data.ag1HausNr);
  setText(form, "txtfAGPlz", data.ag1Plz);
  setText(form, "txtfAGOrt", data.ag1Ort);
  checkBox(form, "chbxEinkommenMonat", data.einkommenMonat);
  checkBox(form, "chbxEinkommenFolgemonat", data.einkommenFolgemonat);
  setText(form, "txtfAG2Name", data.ag2Name);
  setText(form, "txtfAG2Str", data.ag2Str);
  setText(form, "txtfAG2HausNr", data.ag2HausNr);
  setText(form, "txtfAG2Plz", data.ag2Plz);
  setText(form, "txtfAG2Ort", data.ag2Ort);
  checkBox(form, "chbxWeitereEinkommenMonat", data.weitereMonat);
  checkBox(form, "chbxWeitereEinkommenFolgemonat", data.weitereFolgemonat);
  setRadio(form, "rbtnEinkommenFreiberuflich", "/0", "/1", data.istFreiberuflich);
  setRadio(form, "rbtnAufwandEhrenamtlich", "/0", "/1", data.hatEhrenamt);

  // Income checkboxes
  checkBox(form, "chbxEinnahmeWohngeld", data.einnahmen.wohngeld);
  checkBox(form, "chbxEinnahmeArbeitslosengeld", data.einnahmen.arbeitslosengeld);
  checkBox(form, "chbxEinnahmeKrankengeld", data.einnahmen.krankengeld);
  checkBox(form, "chbxEinnahmeÜbergangsgeld", data.einnahmen.uebergangsgeld);
  checkBox(form, "chbxEinnahmeKurzarbeitergeld", data.einnahmen.kurzarbeitergeld);
  checkBox(form, "chbxEinnahmeInsolvenzgeld", data.einnahmen.insolvenzgeld);
  checkBox(form, "chbxEinnahmeElterngeld", data.einnahmen.elterngeld);
  checkBox(form, "chbxEinnahmeKindergeld", data.einnahmen.kindergeld);
  checkBox(form, "chbxEinnahmeKinderzuschlag", data.einnahmen.kinderzuschlag);
  checkBox(form, "chbxEinnahmeUnterhalt", data.einnahmen.unterhalt);
  checkBox(form, "chbxEinnahmeUnterhaltsvorschuss", data.einnahmen.unterhaltsvorschuss);
  checkBox(form, "chbxEinnahmeBAfoeG", data.einnahmen.bafög);
  checkBox(form, "chbxEinnahmeBAB", data.einnahmen.bab);
  checkBox(form, "chbxEinnahmeAusbildungsgeld", data.einnahmen.ausbildungsgeld);

  // Page 3 — More income + travel
  checkBox(form, "chbxEinnahmeRenten", data.einnahmen.renten);
  checkBox(form, "chbxEinnahmeVermietung", data.einnahmen.vermietung);
  checkBox(form, "chbxEinnahmeSozialhilfe", data.einnahmen.sozialhilfe);
  checkBox(form, "chbxEinnahmeSachbezuege", data.einnahmen.sachbezuege);
  checkBox(form, "chbxEinnahmeDigital", data.einnahmen.digital);
  checkBox(form, "chbxEinnahmeSonstige", data.einnahmen.sonstige);
  setText(form, "txtfEinnahmeAndere", data.einnahmen.sonstigeText);
  checkBox(form, "chbxEinnahmeKeine", data.einnahmen.keine);
  setRadio(form, "rbtnAusgabeFahrt", "/0", "/1", data.hatFahrtkosten);
  setText(form, "txtfArbeitsstaetteStr", data.arbeitsstaetteStr);
  setText(form, "txtfArbeitsstaetteHausNr", data.arbeitsstaetteHausNr);
  setText(form, "txtfArbeitsstaettePlz", data.arbeitsstaettePlz);
  setText(form, "txtfArbeitsstaetteOrt", data.arbeitsstaetteOrt);
  setText(form, "numfArbeitsstaetteStrecke", data.streckeKm);
  setText(form, "numfArbeitsstaetteFahrtWoche", data.fahrtenProWoche);
  checkBox(form, "chbxArbeitsstaetteFahrtKFZ", data.fahrtKfz);
  checkBox(form, "chbxArbeitsstaetteFahrtOeffis", data.fahrtOeffis);
  checkBox(form, "chbxArbeitsstaetteFahrtSonstiges", data.fahrtSonstiges);
  setText(form, "txtfArbeitsstaetteFahrtSonstiges", data.fahrtSonstigesText);
  // These radio buttons have full descriptive export values
  try {
    const fahrkostenGroup = form.getRadioGroup("rbtnFahrkostenZuschuss");
    const opts = fahrkostenGroup.getOptions();
    fahrkostenGroup.select(data.fahrkostenZuschuss === "ja" ? opts[0] : opts[1]);
  } catch {}
  try {
    const ausgabeGroup = form.getRadioGroup("rbtnAusgabe");
    const opts = ausgabeGroup.getOptions();
    ausgabeGroup.select(data.hatAusgaben === "ja" ? opts[0] : opts[1]);
  } catch {}

  // Page 4 — Insurance & family
  checkBox(form, "chbxVersicherungKfz", data.versicherungKfz);
  checkBox(form, "chbxVersicherungGesetzlich", data.versicherungGesetzlich);
  checkBox(form, "chbxVersicherungAltersvorsorge", data.versicherungAltersvorsorge);
  checkBox(form, "chbxVersicherungPrivat", data.versicherungPrivat);
  setRadio(form, "rbtnKind", "/0", "/1", data.hatKinder);
  setRadio(form, "rbtnUnterhaltszahlung", "/0", "/1", data.zahltUnterhalt);
  setRadio(form, "rbtnAusbildungsfoerderung", "/0", "/1", data.hatAusbildungsfoerderung);
  setText(form, "dateUnterschriftPerson", data.datumUnterschrift);

  const filledBytes = await pdfDoc.save();
  return new Response(Buffer.from(filledBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Anlage-EK.pdf"',
    },
  });
}
