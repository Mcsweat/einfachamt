"use client";

import { useMemo, useState } from "react";
import { BottomActionBar } from "@/components/BottomActionBar";
import { EditableResponse } from "@/components/EditableResponse";
import { ResponseButton } from "@/components/ResponseButton";
import { copy, type Language } from "@/lib/i18n";
import type { LetterSignals } from "@/lib/knowledge-base";
import {
  buildResponseDraft,
  type ResponseTypeId,
} from "@/lib/response-drafts";

const responseTypeIds: ResponseTypeId[] = [
  "extension",
  "submitted",
  "objection",
  "sick",
  "explain",
];

type ResponseDraftClientProps = {
  language: Language;
  documentId: string;
  signals: LetterSignals;
};

type Tone = "short" | "polite" | "urgent";

export function ResponseDraftClient({
  language,
  documentId,
  signals,
}: ResponseDraftClientProps) {
  const t = copy[language];
  const responseTypes = useMemo(
    () =>
      responseTypeIds.map((id) => ({
        id,
        label: t.responseTypes[id],
      })),
    [t.responseTypes],
  );
  const [selectedType, setSelectedType] = useState<ResponseTypeId>(
    responseTypes[0].id,
  );
  const [draft, setDraft] = useState<string>(() =>
    buildResponseDraft(responseTypes[0].id, language, signals, documentId),
  );
  const [tone, setTone] = useState<Tone>("polite");
  const [ownSituation, setOwnSituation] = useState("");
  const [copied, setCopied] = useState(false);

  function applyTone(baseDraft: string, nextTone: Tone) {
    if (nextTone === "short") {
      return baseDraft
        .split("\n\n")
        .filter((paragraph, index) => index === 0 || index === 1 || index === 3)
        .join("\n\n");
    }

    if (nextTone === "urgent") {
      const urgentLine =
        language === "de"
          ? "Ich bitte um eine zeitnahe Rückmeldung, da eine Frist laufen kann."
          : "I kindly ask for a timely response because a deadline may be running.";

      return baseDraft.includes(urgentLine)
        ? baseDraft
        : baseDraft.replace(/\n\nMit freundlichen Grüßen|\n\nKind regards/, `\n\n${urgentLine}$&`);
    }

    return baseDraft;
  }

  function composeDraft(type: ResponseTypeId, nextTone: Tone, situation: string) {
    const baseDraft = applyTone(
      buildResponseDraft(type, language, signals, documentId),
      nextTone,
    );

    if (!situation.trim()) {
      return baseDraft;
    }

    const situationLine =
      language === "de"
        ? `\n\nMeine Situation: ${situation.trim()}`
        : `\n\nMy situation: ${situation.trim()}`;

    return baseDraft.replace(
      /\n\nMit freundlichen Grüßen|\n\nKind regards/,
      `${situationLine}$&`,
    );
  }

  function selectType(type: ResponseTypeId) {
    setSelectedType(type);
    setDraft(composeDraft(type, tone, ownSituation));
    setCopied(false);
  }

  function selectTone(nextTone: Tone) {
    setTone(nextTone);
    setDraft(composeDraft(selectedType, nextTone, ownSituation));
    setCopied(false);
  }

  function updateSituation(value: string) {
    setOwnSituation(value);
    setDraft(composeDraft(selectedType, tone, value));
    setCopied(false);
  }

  async function copyDraft() {
    await window.navigator.clipboard.writeText(draft);
    setCopied(true);
  }

  return (
    <>
      <div className="space-y-3">
        {responseTypes.map((type) => (
          <ResponseButton
            key={type.id}
            label={type.label}
            active={selectedType === type.id}
            onClick={() => selectType(type.id)}
          />
        ))}
      </div>

      <section className="mt-6 rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
        <h2 className="text-xl font-bold text-ink">{t.toneTitle}</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            ["short", t.toneShort],
            ["polite", t.tonePolite],
            ["urgent", t.toneUrgent],
          ].map(([toneId, label]) => (
            <button
              key={toneId}
              type="button"
              onClick={() => selectTone(toneId as Tone)}
              className={`min-h-12 rounded-full px-3 text-sm font-bold transition active:scale-[0.98] ${
                tone === toneId
                  ? "bg-trust-500 text-white"
                  : "bg-trust-100 text-trust-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <label
          htmlFor="own-situation"
          className="mt-5 block text-base font-bold text-ink"
        >
          {t.ownSituation}
        </label>
        <textarea
          id="own-situation"
          value={ownSituation}
          onChange={(event) => updateSituation(event.target.value)}
          placeholder={t.ownSituationPlaceholder}
          className="mt-3 min-h-24 w-full resize-none rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-base leading-7 text-slate-900 outline-none transition focus:border-trust-500 focus:ring-4 focus:ring-trust-100"
        />
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-2xl font-bold text-ink">{t.draftTitle}</h2>
        <EditableResponse value={draft} onChange={setDraft} />
      </section>

      <BottomActionBar>
        <button
          type="button"
          onClick={copyDraft}
          className="min-h-14 rounded-full bg-trust-500 px-5 py-4 text-[17px] font-bold text-white shadow-soft transition active:scale-[0.98]"
        >
          {copied ? t.copied : t.copyText}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-12 rounded-full bg-trust-100 px-5 py-3 font-bold text-trust-500 transition active:scale-[0.99]"
        >
          {t.savePdf}
        </button>
      </BottomActionBar>
    </>
  );
}
