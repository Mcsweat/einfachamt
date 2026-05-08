"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { type AnalysisResult } from "@/lib/document-data";

type AnalysisSourceBadgeProps = {
  documentId: string;
  initialSource: AnalysisResult["source"];
  labels?: Record<AnalysisResult["source"], string>;
};

const defaultLabels: Record<AnalysisResult["source"], string> = {
  supabase: "Analyse gespeichert",
  pending: "Analyse vorbereitet",
  mock: "Demo-Analyse",
};

function getLabel(
  source: AnalysisResult["source"],
  labels: Record<AnalysisResult["source"], string>,
) {
  if (source === "supabase") {
    return labels.supabase;
  }

  if (source === "pending") {
    return labels.pending;
  }

  return labels.mock;
}

export function AnalysisSourceBadge({
  documentId,
  initialSource,
  labels = defaultLabels,
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
      {getLabel(source, labels)}
    </p>
  );
}
