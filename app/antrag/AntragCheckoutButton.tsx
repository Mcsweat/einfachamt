"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  isLoggedIn: boolean;
  ctaLabel: string;
  loadingLabel: string;
  errorLabel?: string;
};

export function AntragCheckoutButton({ isLoggedIn, ctaLabel, loadingLabel, errorLabel }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function start() {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();

      if (!isLoggedIn || !sessionData.session || sessionData.session.user.is_anonymous) {
        window.location.href = "/login?next=/antrag&reason=antrag";
        return;
      }

      const res = await fetch("/api/stripe/antrag-checkout", { method: "POST" });
      const data = (await res.json()) as { ok: boolean; url?: string; error?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? errorLabel ?? "Fehler beim Checkout.");
      }

      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : (errorLabel ?? "Unbekannter Fehler."));
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={start}
        disabled={loading}
        className="flex min-h-14 w-full items-center justify-center rounded-full bg-trust-500 px-5 text-center text-lg font-bold text-white shadow-soft transition active:scale-[0.98] disabled:opacity-70"
      >
        {loading ? loadingLabel : ctaLabel}
      </button>
      {error && (
        <p className="rounded-[1rem] bg-amber-50 p-4 text-sm font-bold text-amber-900">{error}</p>
      )}
    </div>
  );
}
