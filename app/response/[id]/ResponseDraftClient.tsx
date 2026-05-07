"use client";

import { useState } from "react";
import { BottomActionBar } from "@/components/BottomActionBar";
import { EditableResponse } from "@/components/EditableResponse";
import { ResponseButton } from "@/components/ResponseButton";
import { responseDrafts, responseTypes } from "@/lib/mock-data";

type ResponseTypeId = keyof typeof responseDrafts;

export function ResponseDraftClient() {
  const [selectedType, setSelectedType] = useState<ResponseTypeId>(
    responseTypes[0].id,
  );
  const [draft, setDraft] = useState(responseDrafts[responseTypes[0].id]);
  const [copied, setCopied] = useState(false);

  function selectType(type: ResponseTypeId) {
    setSelectedType(type);
    setDraft(responseDrafts[type]);
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
        <h2 className="mb-3 text-2xl font-bold text-ink">Dein Entwurf</h2>
        <EditableResponse value={draft} onChange={setDraft} />
      </section>

      <BottomActionBar>
        <button
          type="button"
          onClick={copyDraft}
          className="min-h-14 rounded-full bg-trust-500 px-5 py-4 text-[17px] font-bold text-white shadow-soft transition active:scale-[0.98]"
        >
          {copied ? "Kopiert" : "Text kopieren"}
        </button>
        <button
          type="button"
          className="min-h-12 rounded-full bg-trust-100 px-5 py-3 font-bold text-trust-500 transition active:scale-[0.99]"
        >
          PDF speichern (bald)
        </button>
      </BottomActionBar>
    </>
  );
}
