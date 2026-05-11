import { PDFDocument } from "pdf-lib";
import { readFileSync } from "fs";
import path from "path";
import { getCurrentUserSubscription } from "@/lib/subscription";

export type AntragFormData = {
  // Step 0 — Personal
  vorname: string;
  nachname: string;
  gebName: string;
  gebDatum: string; // TT.MM.JJJJ
  gebOrt: string;
  gebLand: string;
  staat: string;
  gender: "m" | "w" | "d" | "k";
  // Step 1 — Address
  strasse: string;
  hausnr: string;
  plz: string;
  ort: string;
  tel: string;
  // Step 2 — Bank & IDs
  iban: string;
  kontoinhaber: string;
  rvStatus: "vorhanden" | "keine" | "beantragt";
  rvNr: string;
  steurId: string;
  // Step 3 — Situation
  antragAb: "sofort" | "spaeter";
  antragDatum: string;
  famstand: "ledig" | "verheiratet" | "verwitwet" | "eingetragen" | "getrennt" | "geschieden" | "aufgehoben";
  kvTyp: "gkv" | "pkv";
  kvName: string;
  hatWohnkosten: boolean;
  mitbewohner: string[];
};

// ── Safe helpers ─────────────────────────────────────────────────────────────

function setText(form: ReturnType<PDFDocument["getForm"]>, name: string, value: string) {
  if (!value) return;
  try { form.getTextField(name).setText(value); } catch { /* field absent */ }
}

function checkBox(form: ReturnType<PDFDocument["getForm"]>, name: string, on: boolean) {
  try {
    const cb = form.getCheckBox(name);
    on ? cb.check() : cb.uncheck();
  } catch { /* field absent */ }
}

// German government PDFs typically export radio values as "Ja"/"Nein"
function setRadio(form: ReturnType<PDFDocument["getForm"]>, name: string, isYes: boolean) {
  const yesValues = ["Ja", "ja", "J", "1", "Yes"];
  const noValues  = ["Nein", "nein", "N", "2", "No"];
  const attempts  = isYes ? yesValues : noValues;
  for (const v of attempts) {
    try { form.getRadioGroup(name).select(v); return; } catch { /* try next */ }
  }
}

// ── Route ────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  // 1. Auth — Plus members only
  const subscription = await getCurrentUserSubscription();
  if (!subscription.isPaid) {
    return Response.json({ error: "Plus subscription required." }, { status: 403 });
  }

  // 2. Parse input
  let data: AntragFormData;
  try {
    data = (await request.json()) as AntragFormData;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  // 3. Load PDF template
  const templatePath = path.join(process.cwd(), "public", "templates", "antrag-sgb2.pdf");
  const templateBytes = readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  // 4. Fill fields ─────────────────────────────────────────────────────────

  // ── A. Personal data ──
  setText(form, "txtfPersonVorname",  data.vorname);
  setText(form, "txtfPersonNachname", data.nachname);
  setText(form, "txtfPersonGebName",  data.gebName);
  setText(form, "datePersonGebDatum", data.gebDatum);
  setText(form, "txtfPersonGebOrt",   data.gebOrt);
  setText(form, "txtfPersonGebLand",  data.gebLand);
  setText(form, "txtfPersonStaat",    data.staat);

  checkBox(form, "chbxMaennlich",    data.gender === "m");
  checkBox(form, "chbxWeiblich",     data.gender === "w");
  checkBox(form, "chbxDivers",       data.gender === "d");
  checkBox(form, "chbxKeineAngabe",  data.gender === "k");

  // ── B. Address ──
  setText(form, "txtfPersonStr",     data.strasse);
  setText(form, "txtfPersonHausNr",  data.hausnr);
  setText(form, "txtfPersonPlz",     data.plz);
  setText(form, "txtfPersonOrt",     data.ort);
  setText(form, "txtfPersonTel",     data.tel);

  // ── C. Banking ──
  setText(form, "txtfKontoIBAN", data.iban.replace(/\s/g, "")); // strip spaces
  setText(form, "txtfKonto",     data.kontoinhaber);

  // ── D. ID Numbers ──
  checkBox(form, "chbxRVNrVorhanden", data.rvStatus === "vorhanden");
  checkBox(form, "chbxRVNrKeine",     data.rvStatus === "keine");
  checkBox(form, "chbxRVNrBeantragt", data.rvStatus === "beantragt");
  if (data.rvStatus === "vorhanden") setText(form, "txtfRVNr", data.rvNr);
  setText(form, "numfStIDNr", data.steurId);

  // ── E. Application start ──
  checkBox(form, "chbxBUEGSofort",  data.antragAb === "sofort");
  checkBox(form, "chbxBUEGSpaeter", data.antragAb === "spaeter");
  if (data.antragAb === "spaeter") setText(form, "dateBUEGSpaeter", data.antragDatum);

  // ── F. Marital status ──
  checkBox(form, "chbxFamStandLedig",       data.famstand === "ledig");
  checkBox(form, "chbxFamStandVerheiratet", data.famstand === "verheiratet");
  checkBox(form, "chbxFamStandVerwitwet",   data.famstand === "verwitwet");
  checkBox(form, "chbxFamStandEingetragen", data.famstand === "eingetragen");
  checkBox(form, "chbxFamStandGetrennt",    data.famstand === "getrennt");
  checkBox(form, "chbxFamStandGeschieden",  data.famstand === "geschieden");
  checkBox(form, "chbxFamStandAufgehoben",  data.famstand === "aufgehoben");

  // ── G. Health insurance ──
  setRadio(form, "rbtnKVPV", data.kvTyp === "gkv");
  setRadio(form, "rbtnPKV",  data.kvTyp === "pkv");
  setText(form, "txtfKV", data.kvName);

  // ── H. Housing & household ──
  setRadio(form, "rbtnWohnsituation",  data.hatWohnkosten);
  setRadio(form, "rbtnBedarfUnterkunft", data.mitbewohner.length > 0);
  checkBox(form, "chbxWohnenEhegatte",  data.mitbewohner.includes("ehegatte"));
  checkBox(form, "chbxWohnenKind",      data.mitbewohner.includes("kind"));
  checkBox(form, "chbxWohnenKindU15",   data.mitbewohner.includes("kindU15"));
  checkBox(form, "chbxWohnenEltern",    data.mitbewohner.includes("eltern"));
  checkBox(form, "chbxWohnenVerwandte", data.mitbewohner.includes("verwandte"));
  checkBox(form, "chbxWohnenSonstige",  data.mitbewohner.includes("sonstige"));

  // 5. Flatten only appearance streams — keep fields editable for manual review
  // (don't call form.flatten() — user needs to add remaining fields and sign)

  // 6. Serialize and return
  const filledBytes = await pdfDoc.save();

  return new Response(Buffer.from(filledBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Buergergeld-Antrag-HA.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
