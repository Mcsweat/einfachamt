"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { copy, type Language } from "@/lib/i18n";

type LoginFormProps = {
  nextPath?: string;
  language?: Language;
};

export function LoginForm({
  nextPath = "/pricing",
  language = "de",
}: LoginFormProps) {
  const t = copy[language];
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const redirectTo = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(
      nextPath,
    )}`;
  }, [nextPath]);

  async function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    const supabase = createClient();
    const { data: sessionData } = await supabase.auth.getSession();

    if (sessionData.session?.user.is_anonymous) {
      await supabase.auth.signOut();
    }

    const { error: loginError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
      },
    });

    if (loginError) {
      setError(loginError.message);
      setIsLoading(false);
      return;
    }

    setMessage(t.loginLinkSent);
    setIsLoading(false);
  }

  return (
    <form onSubmit={submitLogin} className="mt-7 rounded-[2rem] bg-white/95 p-5 shadow-sm">
      <label htmlFor="email" className="text-lg font-bold text-ink">
        {t.emailAddress}
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="name@example.com"
        className="mt-3 min-h-14 w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 text-lg outline-none transition focus:border-trust-500 focus:ring-4 focus:ring-trust-100"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 flex min-h-14 w-full items-center justify-center rounded-full bg-trust-500 px-5 py-4 text-lg font-bold text-white shadow-soft disabled:opacity-70"
      >
        {isLoading ? t.sendingLink : t.sendLoginLink}
      </button>
      {message ? (
        <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-base font-bold leading-6 text-emerald-800">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-base font-bold leading-6 text-amber-900">
          {error}
        </p>
      ) : null}
    </form>
  );
}
