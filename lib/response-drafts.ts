import type { LetterSignals } from "@/lib/knowledge-base";
import type { Language } from "@/lib/i18n";

export type ResponseTypeId =
  | "extension"
  | "submitted"
  | "objection"
  | "sick"
  | "explain";

type DraftBuilder = (signals: LetterSignals) => string;

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickVariant<T>(items: T[], seed: string): T {
  return items[hashString(seed) % items.length];
}

function salutation(signals: LetterSignals, language: Language): string {
  const name = signals.sachbearbeiter;
  if (!name) {
    return language === "de"
      ? "Sehr geehrte Damen und Herren"
      : "Dear Sir or Madam";
  }
  if (language === "en") {
    return `Dear ${name}`;
  }
  if (/^Frau\b/.test(name)) {
    return `Sehr geehrte ${name}`;
  }
  return `Sehr geehrter ${name}`;
}

function letterReference(signals: LetterSignals, language: Language): string {
  const date = signals.briefdatum;
  const az = signals.aktenzeichen ?? signals.meinZeichen;
  const kunde = signals.kundennummer;

  if (language === "en") {
    const parts: string[] = [];
    if (date) parts.push(`your letter dated ${date}`);
    if (az) parts.push(`reference ${az}`);
    if (kunde) parts.push(`customer number ${kunde}`);
    return parts.length > 0 ? parts.join(", ") : "your letter";
  }

  const parts: string[] = [];
  if (date) parts.push(`Ihr Schreiben vom ${date}`);
  if (az) parts.push(`Aktenzeichen ${az}`);
  if (kunde) parts.push(`Kundennummer ${kunde}`);
  return parts.length > 0 ? parts.join(", ") : "Ihr Schreiben";
}

function close(language: Language): string {
  return language === "de" ? "Mit freundlichen Grüßen" : "Kind regards";
}

const variantsDe: Record<ResponseTypeId, DraftBuilder[]> = {
  extension: [
    (s) =>
      `${salutation(s, "de")},\n\nin Bezug auf ${letterReference(s, "de")} bitte ich um eine Verlängerung der gesetzten Frist. Ich benötige etwas mehr Zeit, um die geforderten Unterlagen vollständig zusammenzustellen.\n\nIch werde die Unterlagen schnellstmöglich nachreichen.\n\n${close("de")}`,
    (s) =>
      `${salutation(s, "de")},\n\nich beziehe mich auf ${letterReference(s, "de")}. Da ich die angeforderten Nachweise noch beschaffe, beantrage ich hiermit eine angemessene Fristverlängerung.\n\nDie vollständigen Unterlagen reiche ich umgehend nach.\n\n${close("de")}`,
    (s) =>
      `${salutation(s, "de")},\n\nhiermit bitte ich Sie höflich um eine Fristverlängerung in Bezug auf ${letterReference(s, "de")}. Aus organisatorischen Gründen kann ich die Unterlagen nicht innerhalb der ursprünglichen Frist einreichen.\n\nIch danke Ihnen im Voraus für Ihr Verständnis.\n\n${close("de")}`,
  ],
  submitted: [
    (s) =>
      `${salutation(s, "de")},\n\nin Bezug auf ${letterReference(s, "de")} teile ich mit, dass ich die geforderten Unterlagen bereits eingereicht habe.\n\nBitte bestätigen Sie mir den Eingang schriftlich.\n\n${close("de")}`,
    (s) =>
      `${salutation(s, "de")},\n\nin Erledigung Ihrer Aufforderung aus ${letterReference(s, "de")} habe ich Ihnen die angeforderten Nachweise übermittelt.\n\nIch bitte um eine kurze Bestätigung des Eingangs.\n\n${close("de")}`,
    (s) =>
      `${salutation(s, "de")},\n\nbezugnehmend auf ${letterReference(s, "de")} möchte ich Sie informieren, dass die verlangten Unterlagen vollständig nachgereicht wurden.\n\nFür eine schriftliche Bestätigung wäre ich Ihnen dankbar.\n\n${close("de")}`,
  ],
  objection: [
    (s) =>
      `${salutation(s, "de")},\n\nhiermit lege ich gegen Ihren Bescheid (${letterReference(s, "de")}) fristwahrend Widerspruch ein.\n\nBitte übersenden Sie mir eine nachvollziehbare Begründung der Entscheidung und prüfen Sie den Sachverhalt erneut.\n\n${close("de")}`,
    (s) =>
      `${salutation(s, "de")},\n\ngegen die mit ${letterReference(s, "de")} mitgeteilte Entscheidung erhebe ich hiermit fristgerecht Widerspruch.\n\nEine ausführliche Begründung reiche ich nach. Ich bitte Sie, die Sache neu zu prüfen.\n\n${close("de")}`,
    (s) =>
      `${salutation(s, "de")},\n\nin Bezug auf ${letterReference(s, "de")} möchte ich Widerspruch einlegen. Ich halte die getroffene Entscheidung für nicht zutreffend.\n\nBitte erläutern Sie mir die Grundlage der Entscheidung schriftlich.\n\n${close("de")}`,
  ],
  sick: [
    (s) =>
      `${salutation(s, "de")},\n\nin Bezug auf ${letterReference(s, "de")} möchte ich Sie darüber informieren, dass ich derzeit krankheitsbedingt verhindert bin und die geforderten Schritte nicht zeitnah erledigen kann.\n\nIch melde mich, sobald sich mein Gesundheitszustand stabilisiert hat. Eine Krankmeldung reiche ich nach.\n\n${close("de")}`,
    (s) =>
      `${salutation(s, "de")},\n\nbezugnehmend auf ${letterReference(s, "de")} muss ich Ihnen mitteilen, dass ich aktuell krank bin und Ihre Aufforderung nicht fristgemäß erfüllen kann.\n\nUm Verständnis und ggf. um eine Fristverlängerung wird gebeten. Den ärztlichen Nachweis lege ich bei.\n\n${close("de")}`,
    (s) =>
      `${salutation(s, "de")},\n\nleider erreicht mich ${letterReference(s, "de")} während einer Krankheitsphase. Ich kann die geforderten Unterlagen daher nicht sofort einreichen.\n\nIch werde mich zeitnah bei Ihnen melden und die Nachweise nachreichen.\n\n${close("de")}`,
  ],
  explain: [
    (s) =>
      `${salutation(s, "de")},\n\nim Hinblick auf ${letterReference(s, "de")} bitte ich Sie um eine verständliche Erläuterung der getroffenen Entscheidung.\n\nFür mich ist nicht klar, welche konkreten Schritte oder Unterlagen Sie erwarten.\n\n${close("de")}`,
    (s) =>
      `${salutation(s, "de")},\n\nbezogen auf ${letterReference(s, "de")} bitte ich um eine Erklärung in einfacher Sprache. Mir ist der genaue Sachverhalt aus dem Schreiben nicht ersichtlich.\n\nBitte teilen Sie mir mit, was von mir erwartet wird.\n\n${close("de")}`,
    (s) =>
      `${salutation(s, "de")},\n\nin Bezug auf ${letterReference(s, "de")} habe ich Verständnisfragen. Können Sie mir die Hintergründe und die nächsten Schritte schriftlich erläutern?\n\nIch danke Ihnen im Voraus für Ihre Rückmeldung.\n\n${close("de")}`,
  ],
};

const variantsEn: Record<ResponseTypeId, DraftBuilder[]> = {
  extension: [
    (s) =>
      `${salutation(s, "en")},\n\nwith reference to ${letterReference(s, "en")}, I kindly ask for an extension of the deadline. I need a little more time to gather all the requested documents.\n\nI will submit them as soon as possible.\n\n${close("en")}`,
    (s) =>
      `${salutation(s, "en")},\n\nI refer to ${letterReference(s, "en")}. As I am still collecting the requested documents, I would like to apply for an extension of the deadline.\n\nThe complete documents will follow shortly.\n\n${close("en")}`,
    (s) =>
      `${salutation(s, "en")},\n\nthis is a polite request for an extension regarding ${letterReference(s, "en")}. For organisational reasons I cannot meet the original deadline.\n\nThank you in advance for your understanding.\n\n${close("en")}`,
  ],
  submitted: [
    (s) =>
      `${salutation(s, "en")},\n\nregarding ${letterReference(s, "en")}, I would like to inform you that I have already submitted the requested documents.\n\nPlease confirm receipt in writing.\n\n${close("en")}`,
    (s) =>
      `${salutation(s, "en")},\n\nin response to ${letterReference(s, "en")}, the requested evidence has been provided to your office.\n\nA short written confirmation of receipt would be appreciated.\n\n${close("en")}`,
    (s) =>
      `${salutation(s, "en")},\n\nwith reference to ${letterReference(s, "en")} I want to confirm that the required documents have been submitted in full.\n\nI would appreciate a written confirmation.\n\n${close("en")}`,
  ],
  objection: [
    (s) =>
      `${salutation(s, "en")},\n\nI hereby file an objection within the deadline against your decision (${letterReference(s, "en")}).\n\nPlease provide a clear justification and review the matter again.\n\n${close("en")}`,
    (s) =>
      `${salutation(s, "en")},\n\nagainst the decision communicated in ${letterReference(s, "en")} I am filing a timely objection.\n\nA detailed reasoning will follow. Please reconsider the matter.\n\n${close("en")}`,
    (s) =>
      `${salutation(s, "en")},\n\nin relation to ${letterReference(s, "en")} I would like to lodge an objection. I do not consider the decision to be correct.\n\nPlease explain the basis of the decision in writing.\n\n${close("en")}`,
  ],
  sick: [
    (s) =>
      `${salutation(s, "en")},\n\nregarding ${letterReference(s, "en")}, I am currently unable to act due to illness and cannot meet the required steps in time.\n\nI will get back to you as soon as my health allows. A medical certificate will follow.\n\n${close("en")}`,
    (s) =>
      `${salutation(s, "en")},\n\nin connection with ${letterReference(s, "en")}, I must inform you that I am currently sick and unable to comply with the deadline.\n\nI ask for your understanding and, if possible, an extension. The medical certificate is enclosed.\n\n${close("en")}`,
    (s) =>
      `${salutation(s, "en")},\n\nunfortunately ${letterReference(s, "en")} reaches me during a period of illness. I cannot submit the requested documents immediately.\n\nI will contact you again soon and provide the missing evidence.\n\n${close("en")}`,
  ],
  explain: [
    (s) =>
      `${salutation(s, "en")},\n\nregarding ${letterReference(s, "en")}, I would kindly ask you to explain the decision in simple words.\n\nIt is not clear to me which steps or documents you expect from me.\n\n${close("en")}`,
    (s) =>
      `${salutation(s, "en")},\n\nwith reference to ${letterReference(s, "en")} I would like to ask for a clear explanation. The exact situation does not become clear to me.\n\nPlease let me know what you expect from me.\n\n${close("en")}`,
    (s) =>
      `${salutation(s, "en")},\n\nI have questions about ${letterReference(s, "en")}. Could you describe the background and the next steps in writing?\n\nThank you in advance for your reply.\n\n${close("en")}`,
  ],
};

export function buildResponseDraft(
  type: ResponseTypeId,
  language: Language,
  signals: LetterSignals,
  seed: string,
): string {
  const variants = (language === "de" ? variantsDe : variantsEn)[type];
  const builder = pickVariant(variants, `${type}:${seed}`);
  return builder(signals);
}
