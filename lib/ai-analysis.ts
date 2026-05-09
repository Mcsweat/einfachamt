import Anthropic from "@anthropic-ai/sdk";
import type { KnowledgeAnalysis } from "@/lib/knowledge-base";

const SYSTEM_PROMPT = `Du bist ein Assistent, der Briefe vom deutschen Jobcenter und der Bundesagentur fuer Arbeit fuer Buergergeld-Empfaenger in einfacher Sprache erklaert.

Deine Aufgaben:
1. Erkenne den Brieftyp praezise (Anhoerung, Bescheid, Termin/Einladung, Telefonischer Beratungstermin, Unterlagen nachfordern, Aufhebung, Sanktion, Erstattung, Mitwirkungspflicht, Eingliederungsvereinbarung, etc.)
2. Erklaere kurz und in einfacher Sprache, was der Brief will (1-2 Saetze, ohne Behoerden-Floskeln)
3. Extrahiere alle Datumsangaben und Uhrzeiten exakt wie sie im Brief stehen
4. Identifiziere Fristen und konkrete To-dos
5. Beschreibe das Risiko bei Nichtreaktion
6. Erstelle einen hoeflichen, persoenlichen Antwortentwurf mit Bezug auf konkrete Brief-Details

Wichtige Regeln:
- Telefonische Beratungstermine: Der Empfaenger wird angerufen und muss nichts veranlassen. Er soll nur erreichbar sein.
- Persoenliche Termine: Der Empfaenger muss erscheinen.
- Datumsformat: DD.MM.YYYY
- Uhrzeiten: Nur echte Uhrzeiten im Format HH:MM oder HH:MM Uhr extrahieren. Ignoriere Postnummern, Versionsangaben oder Codes wie "DV 02.26" oder "K4000".
- Antwortentwurf: Nimm Bezug auf konkrete Fakten (Aktenzeichen, Datum, Sachbearbeiter:in, Kundennummer falls vorhanden). Keine Vorlage, sondern individuell.
- Antworte ausschliesslich auf Deutsch.
- Verwende klare, einfache Woerter — keine Juristensprache.`;

const ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    letterType: {
      type: "string",
      description: "Konkreter Brieftyp, z.B. 'Telefonischer Beratungstermin' oder 'Aufhebungsbescheid'",
    },
    summary: {
      type: "string",
      description: "1-2 Saetze in einfacher Sprache: Was will der Brief?",
    },
    authorityRequest: {
      type: "string",
      description: "Was moechte das Amt vom Empfaenger? Konkret und kurz.",
    },
    deadlines: {
      type: "array",
      items: { type: "string" },
      description:
        "Erkannte Termine oder Fristen. Format: 'Termin am DD.MM.YYYY um HH:MM Uhr' oder 'Frist bis DD.MM.YYYY'. Leer lassen wenn keine vorhanden.",
    },
    todos: {
      type: "array",
      items: { type: "string" },
      description: "3-5 konkrete Handlungsschritte fuer den Empfaenger",
    },
    risks: {
      type: "string",
      description: "Was passiert, wenn der Empfaenger nicht reagiert?",
    },
    responseDraft: {
      type: "string",
      description:
        "Persoenlicher, hoeflicher Antwortentwurf (5-12 Zeilen) mit Bezug auf konkrete Fakten aus dem Brief. Kein Template.",
    },
  },
  required: [
    "letterType",
    "summary",
    "authorityRequest",
    "deadlines",
    "todos",
    "risks",
    "responseDraft",
  ],
  additionalProperties: false,
} as const;

type AnalysisJson = {
  letterType: string;
  summary: string;
  authorityRequest: string;
  deadlines: string[];
  todos: string[];
  risks: string;
  responseDraft: string;
};

export type AiAnalysis = KnowledgeAnalysis & {
  responseDraft: string;
};

export function isAiAnalysisAvailable(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

export async function analyzeLetterWithAi(
  text: string,
): Promise<AiAnalysis | null> {
  if (!isAiAnalysisAvailable()) {
    return null;
  }
  if (!text.trim() || text.length < 20) {
    return null;
  }

  const client = new Anthropic();

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 2048,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      output_config: {
        format: { type: "json_schema", schema: ANALYSIS_SCHEMA },
      },
      messages: [
        {
          role: "user",
          content: `Analysiere diesen Brief vom Jobcenter und gib das strukturierte Ergebnis zurueck:\n\n---\n${text}\n---`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return null;
    }

    const parsed = JSON.parse(textBlock.text) as AnalysisJson;

    return {
      letterType: parsed.letterType,
      summary: parsed.summary,
      authorityRequest: parsed.authorityRequest,
      deadlines:
        parsed.deadlines.length > 0
          ? parsed.deadlines
          : ["Keine ausdrueckliche Frist erkannt. Pruefe den Brief sorgfaeltig."],
      todos: parsed.todos,
      risks: parsed.risks,
      responseHint: "Antwort vorbereiten",
      references: [],
      responseDraft: parsed.responseDraft,
    };
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.warn(
        `AI analysis failed (${error.status}): ${error.message.slice(0, 200)}`,
      );
    } else {
      console.warn("AI analysis failed", error);
    }
    return null;
  }
}
