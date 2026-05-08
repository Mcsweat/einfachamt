"use client";

import { useMemo, useState } from "react";
import { BottomActionBar } from "@/components/BottomActionBar";
import { EditableResponse } from "@/components/EditableResponse";
import { ResponseButton } from "@/components/ResponseButton";
import { copy, type Language } from "@/lib/i18n";

type ResponseTypeId = keyof typeof copy.de.responseDrafts;

const responseTypeIds: ResponseTypeId[] = [
  "extension",
  "submitted",
  "objection",
  "sick",
  "explain",
];

type ResponseDraftClientProps = {
  language: Language;
};

export function ResponseDraftClient({ language }: ResponseDraftClientProps) {
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
  const [draft, setDraft] = useState<string>(
    t.responseDrafts[responseTypes[0].id],
  );
  const [copied, setCopied] = useState(false);

  function selectType(type: ResponseTypeId) {
    setSelectedType(type);
    setDraft(t.responseDrafts[type]);
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
          className="min-h-12 rounded-full bg-trust-100 px-5 py-3 font-bold text-trust-500 transition active:scale-[0.99]"
        >
          {t.savePdfSoon}
        </button>
      </BottomActionBar>
    </>
  );
}
