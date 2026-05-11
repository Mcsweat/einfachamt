"use client";

import { useState } from "react";

type Props = {
  label: string;
  loadingLabel: string;
};

export function ManageSubscriptionButton({ label, loadingLabel }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function open() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Fehler");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fehler");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={open}
        disabled={loading}
        className="flex min-h-[54px] w-full items-center gap-3 px-5 text-base font-semibold text-slate-700 transition disabled:opacity-60"
      >
        <span className="text-xl">💳</span>
        <span className="flex-1 text-left">{loading ? loadingLabel : label}</span>
        <span className="text-lg font-semibold text-slate-300">›</span>
      </button>
      {error && (
        <p className="px-5 pb-3 text-sm font-bold text-red-600">{error}</p>
      )}
    </div>
  );
}
