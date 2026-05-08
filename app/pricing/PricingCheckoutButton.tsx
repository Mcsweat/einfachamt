"use client";

import { useState } from "react";
import { copy, type Language } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

type PricingCheckoutButtonProps = {
  isLoggedIn?: boolean;
  language?: Language;
};

export function PricingCheckoutButton({
  isLoggedIn = false,
  language = "de",
}: PricingCheckoutButtonProps) {
  const t = copy[language];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();

      if (!isLoggedIn || !sessionData.session || sessionData.session.user.is_anonymous) {
        window.location.href = "/login?next=/pricing&reason=plus";
        return;
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      });
      const contentType = response.headers.get("content-type") ?? "";
      const data = contentType.includes("application/json")
        ? ((await response.json()) as { url?: string; error?: string })
        : { error: await response.text() };

      if (!response.ok || !data.url) {
        throw new Error(
          data.error ?? t.checkoutError,
        );
      }

      window.location.href = data.url;
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : t.checkoutError,
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={startCheckout}
        disabled={isLoading}
        className="flex min-h-14 w-full items-center justify-center rounded-full bg-trust-500 px-5 py-4 text-center text-lg font-bold text-white shadow-soft transition active:scale-[0.98] disabled:opacity-70"
      >
        {isLoading
          ? t.checkoutContinue
          : isLoggedIn
            ? t.unlockPlus
            : t.emailLogin}
      </button>
      {error ? (
        <p className="mt-3 rounded-2xl bg-amber-50 p-4 text-base font-semibold leading-6 text-amber-900">
          {error}
        </p>
      ) : null}
    </div>
  );
}
