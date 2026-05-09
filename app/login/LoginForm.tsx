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
  const [sent, setSent] = useState(false);
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

    setSent(true);
    setIsLoading(false);
  }

  if (sent) {
    return (
      <div className="mt-7 rounded-[2rem] bg-white/95 p-6 shadow-sm text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-trust-100 text-3xl mx-auto">
          ✉️
        </div>
        <h2 className="mt-4 text-2xl font-bold text-ink">
          {t.loginCheckInbox}
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-700">
          {t.loginLinkSentTo}{" "}
          <span className="font-bold text-ink break-all">{email}</span>
          {". "}
          {t.loginClickLink}
        </p>
        <p className="mt-5 rounded-[1.25rem] bg-slate-50 px-4 py-3 text-sm text-slate-500">
          {t.loginCheckSpam}
        </p>
        <button
          onClick={() => { setSent(false); setEmail(""); }}
          className="mt-5 text-sm font-semibold text-trust-500 underline-offset-2 hover:underline"
        >
          {t.loginTryOtherEmail}
        </button>
      </div>
    );
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
      {error ? (
        <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-base font-bold leading-6 text-amber-900">
          {error}
        </p>
      ) : null}
    </form>
  );
}
