"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { SavedDocument } from "@/lib/saved-documents";

type Labels = {
  renameLetter: string;
  renameLetterSave: string;
  renameLetterCancel: string;
  deleteLetter: string;
  deletingLetter: string;
  deleteLetterConfirm: string;
  deleteLetterError: string;
  statusAnalyzed: string;
  statusReading: string;
  statusUploaded: string;
};

type Props = {
  doc: SavedDocument;
  labels: Labels;
};

function StatusDot({ status, labels }: { status: string; labels: Labels }) {
  if (status === "analyzed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        {labels.statusAnalyzed}
      </span>
    );
  }
  if (status === "reading") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
        {labels.statusReading}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
      {labels.statusUploaded}
    </span>
  );
}

export function DocumentCard({ doc, labels }: Props) {
  const router = useRouter();
  const [name, setName] = useState(doc.fileName);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 50);
  }

  async function saveName() {
    const trimmed = name.trim();
    if (!trimmed) {
      setName(doc.fileName);
      setEditing(false);
      return;
    }
    if (trimmed === doc.fileName) {
      setEditing(false);
      return;
    }
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase
      .from("documents")
      .update({ file_name: trimmed })
      .eq("id", doc.id);
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!window.confirm(labels.deleteLetterConfirm)) return;
    setDeleting(true);
    setError("");
    const supabase = createClient();
    const { data: analyses } = await supabase
      .from("analyses")
      .select("id")
      .eq("document_id", doc.id);
    const ids = (analyses ?? []).map((a) => a.id);
    if (ids.length > 0) {
      await supabase.from("response_drafts").delete().in("analysis_id", ids);
    }
    await supabase.from("analyses").delete().eq("document_id", doc.id);
    if (doc.fileUrl) {
      await supabase.storage.from("documents").remove([doc.fileUrl]);
    }
    const { error: err } = await supabase
      .from("documents")
      .delete()
      .eq("id", doc.id);
    if (err) {
      setError(err.message || labels.deleteLetterError);
      setDeleting(false);
      return;
    }
    router.refresh();
  }

  return (
    <div className="overflow-hidden rounded-[1.55rem] bg-white/95 shadow-sm">

      {/* Main tap area → analysis */}
      <Link
        href={`/analysis/${doc.id}`}
        className="flex items-start gap-4 px-5 pb-3 pt-5"
      >
        {/* Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-trust-50 text-xl">
          📄
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-ink">{name}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <StatusDot status={doc.status} labels={labels} />
            <span className="text-xs text-slate-400">{doc.createdAt}</span>
          </div>
          {doc.deadline && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
              ⏰ {doc.deadline}
            </span>
          )}
          {doc.summary && (
            <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500">
              {doc.summary}
            </p>
          )}
        </div>

        <span className="shrink-0 text-lg font-semibold text-slate-300">›</span>
      </Link>

      {/* Rename input */}
      {editing && (
        <div className="flex items-center gap-2 border-t border-slate-100 px-4 py-3">
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveName();
              if (e.key === "Escape") {
                setName(doc.fileName);
                setEditing(false);
              }
            }}
            className="min-w-0 flex-1 rounded-2xl border border-trust-200 bg-trust-50 px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-trust-500"
            autoFocus
          />
          <button
            onClick={saveName}
            disabled={saving}
            className="rounded-full bg-trust-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-60 transition active:scale-[0.97]"
          >
            {saving ? "…" : labels.renameLetterSave}
          </button>
          <button
            onClick={() => {
              setName(doc.fileName);
              setEditing(false);
            }}
            className="rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-500 transition active:scale-[0.97]"
          >
            ✕
          </button>
        </div>
      )}

      {/* Action row */}
      {!editing && (
        <div className="flex items-center gap-2 border-t border-slate-50 px-4 pb-4 pt-3">
          <button
            onClick={startEdit}
            className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition active:scale-[0.97]"
          >
            ✏️ {labels.renameLetter}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-500 transition active:scale-[0.97] disabled:opacity-60"
          >
            🗑️ {deleting ? labels.deletingLetter : labels.deleteLetter}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mx-4 mb-4 rounded-2xl bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-900">
          {error}
        </p>
      )}
    </div>
  );
}
