"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type DeleteDocumentButtonProps = {
  documentId: string;
  fileUrl: string;
  labels: {
    idle: string;
    loading: string;
    confirm: string;
    error: string;
  };
};

export function DeleteDocumentButton({
  documentId,
  fileUrl,
  labels,
}: DeleteDocumentButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function deleteDocument() {
    if (!window.confirm(labels.confirm)) {
      return;
    }

    setIsDeleting(true);
    setError("");

    const supabase = createClient();
    const { data: analyses } = await supabase
      .from("analyses")
      .select("id")
      .eq("document_id", documentId);
    const analysisIds = (analyses ?? []).map((analysis) => analysis.id);

    if (analysisIds.length > 0) {
      await supabase.from("response_drafts").delete().in("analysis_id", analysisIds);
    }

    await supabase.from("analyses").delete().eq("document_id", documentId);

    if (fileUrl) {
      await supabase.storage.from("documents").remove([fileUrl]);
    }

    const { error: deleteError } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId);

    if (deleteError) {
      setError(deleteError.message || labels.error);
      setIsDeleting(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={deleteDocument}
        disabled={isDeleting}
        className="min-h-11 rounded-full bg-slate-100 px-4 py-2 text-base font-bold text-slate-600 transition active:scale-[0.98] disabled:opacity-70"
      >
        {isDeleting ? labels.loading : labels.idle}
      </button>
      {error ? (
        <p className="mt-2 rounded-2xl bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-900">
          {error}
        </p>
      ) : null}
    </div>
  );
}
