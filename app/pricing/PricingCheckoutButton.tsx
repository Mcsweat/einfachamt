"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function PricingCheckoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setIsLoading(true);
    setError("");

    const supabase = createClient();
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      const { error: authError } = await supabase.auth.signInAnonymously();

      if (authError) {
        setError("Login konnte nicht gestartet werden. Bitte versuche es erneut.");
        setIsLoading(false);
        return;
      }
    }

    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
    });
    const data = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !data.url) {
      setError(data.error ?? "Stripe Checkout konnte nicht gestartet werden.");
      setIsLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={startCheckout}
        disabled={isLoading}
        className="flex min-h-14 w-full items-center justify-center rounded-full bg-trust-500 px-5 py-4 text-center text-lg font-bold text-white shadow-soft transition active:scale-[0.98] disabled:opacity-70"
      >
        {isLoading ? "Weiter zu Stripe..." : "Plus freischalten"}
      </button>
      {error ? (
        <p className="mt-3 rounded-2xl bg-amber-50 p-4 text-base font-semibold leading-6 text-amber-900">
          {error}
        </p>
      ) : null}
    </div>
  );
}
