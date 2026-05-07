"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UploadBox() {
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function handleFile(file?: File) {
    if (!file) {
      return;
    }

    setFileName(file.name);
    setIsLoading(true);

    const metadataPlaceholder = {
      file_name: file.name,
      file_type: file.type || "unknown",
      status: "uploaded",
    };

    window.localStorage.setItem(
      "einfachamt:last-upload",
      JSON.stringify(metadataPlaceholder),
    );

    window.setTimeout(() => {
      router.push("/analysis/mock-upload");
    }, 900);
  }

  return (
    <div className="rounded-3xl border border-dashed border-trust-500 bg-white p-5 shadow-soft">
      <label
        htmlFor="letter-upload"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFile(event.dataTransfer.files[0]);
        }}
        className="flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-3xl bg-trust-50 px-5 py-10 text-center"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl font-bold text-trust-700 shadow-sm">
          +
        </span>
        <span className="mt-5 text-2xl font-bold text-ink">
          Brief als PDF oder Foto hochladen
        </span>
        <span className="mt-3 max-w-sm leading-7 text-slate-600">
          Fotografiere deinen Brief gut lesbar. Akzeptiert werden PDF, JPG und
          PNG.
        </span>
        <input
          id="letter-upload"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="sr-only"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </label>

      <div className="mt-5 rounded-2xl bg-trust-50 p-4 text-sm font-medium text-slate-600">
        {isLoading
          ? "Brief wird gelesen..."
          : fileName
            ? `${fileName} wurde als Platzhalter gespeichert.`
            : "Noch keine Datei ausgewaehlt."}
      </div>
    </div>
  );
}
