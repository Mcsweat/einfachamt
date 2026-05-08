"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadDocument } from "@/lib/upload-document";
import { copy, type Language } from "@/lib/i18n";

type UploadCardProps = {
  language?: Language;
};

export function UploadCard({ language = "de" }: UploadCardProps) {
  const t = copy[language];
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>(t.uploadIdle);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleFile(file?: File) {
    if (!file) {
      return;
    }

    setFileName(file.name);
    setIsLoading(true);
    setError("");
    setMessage(t.uploadUploading);

    try {
      const result = await uploadDocument(file);

      window.localStorage.setItem(
        "einfachamt:last-upload",
        JSON.stringify({
          document_id: result.documentId,
          file_name: result.fileName,
          status: "uploaded",
          mode: result.mode,
        }),
      );

      if (result.mode === "mock") {
        setMessage(result.reason);
      } else {
        setMessage(t.uploadReading);
      }

      window.setTimeout(() => {
        router.push(`/loading/${result.documentId}`);
      }, 650);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : t.uploadError,
      );
      setIsLoading(false);
      setMessage(t.uploadIdle);
    }
  }

  return (
    <section className="rounded-[2rem] bg-white/95 p-3 shadow-soft">
      <label
        htmlFor="letter-upload"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFile(event.dataTransfer.files[0]);
        }}
        className="flex min-h-[330px] cursor-pointer flex-col items-center justify-center rounded-[1.7rem] border-2 border-dashed border-trust-200 bg-slate-50 px-5 py-8 text-center transition hover:border-trust-500 active:scale-[0.99]"
      >
        <span className="flex h-20 w-20 items-center justify-center rounded-[1.45rem] bg-white text-4xl font-semibold text-trust-500 shadow-sm">
          +
        </span>
        <span className="mt-6 text-2xl font-bold leading-tight text-ink">
          {t.uploadCardTitle}
        </span>
        <span className="mt-3 max-w-[280px] text-lg leading-7 text-slate-700">
          {t.uploadCardText}
        </span>
        <span className="mt-3 rounded-full bg-white px-4 py-2 text-base font-semibold text-trust-500 shadow-sm">
          {t.uploadButton}
        </span>
        <input
          id="letter-upload"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          capture="environment"
          className="sr-only"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </label>

      <div
        aria-live="polite"
        className={`mt-4 min-h-14 rounded-[1.25rem] p-4 text-base font-semibold leading-6 ${
          error ? "bg-amber-50 text-amber-900" : "bg-slate-50 text-slate-700"
        }`}
      >
        {error || (isLoading ? t.uploadReading : fileName ? message : message)}
      </div>
    </section>
  );
}
