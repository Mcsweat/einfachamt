"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { type AnalysisResult } from "@/lib/document-data";

type AnalysisSourceBadgeProps = {
  documentId: string;
  initialSource: AnalysisResult["source"];
};

function getLabel(source: AnalysisResult["source"]) {
  if (source === "supabase") {
    return "Analyse gespeichert";
  }

  if (source === "pending") {
    return "Analyse vorbereitet";
  }

  return "Demo-Analyse";
}

export function AnalysisSourceBadge({
  documentId,
  initialSource,
}: AnalysisSourceBadgeProps) {
  const [source, setSource] = useState(initialSource);

  useEffect(() => {
    if (
      initialSource === "supabase" ||
      documentId === "mock-upload" ||
      documentId.startsWith("demo-")
    ) {
      return;
    }

    let isMounted = true;

    async function checkSavedAnalysis() {
      if (window.localStorage.getItem(`einfachamt:analysis:${documentId}`)) {
        setSource("supabase");
        return;
      }

      const supabase = createClient();
      const { data } = await supabase
        .from("analyses")
        .select("id")
        .eq("document_id", documentId)
        .maybeSingle();

      if (isMounted && data) {
        setSource("supabase");
      }
    }

    checkSavedAnalysis();

    return () => {
      isMounted = false;
    };
  }, [documentId, initialSource]);

  return (
    <p className="text-base font-bold text-trust-700" aria-live="polite">
      {getLabel(source)}
    </p>
  );
}
