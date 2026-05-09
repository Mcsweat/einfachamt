import Link from "next/link";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { getSafeUser } from "@/lib/supabase/safe-auth";
import { getCurrentUserSubscription } from "@/lib/subscription";
import { SignOutButton } from "./AccountActions";

export default async function AccountPage() {
  const language = await getLanguage();
  const t = copy[language];
  const user = await getSafeUser();
  const subscription = await getCurrentUserSubscription();

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={t.account}
        backHref="/pricing"
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          {t.accountTitle}
        </h1>
        <div className="mt-7 rounded-[2rem] bg-white/95 p-5 shadow-sm">
          {user && !user.is_anonymous ? (
            <>
              <p className="text-base font-bold text-slate-500">{t.email}</p>
              <p className="mt-1 break-words text-xl font-bold text-ink">
                {user.email}
              </p>
              <p className="mt-5 text-base font-bold text-slate-500">
                {t.subscription}
              </p>
              <p className="mt-1 text-xl font-bold text-ink">
                {subscription.isPaid ? t.plusActive : "Free"}
              </p>
              <SignOutButton label={t.signOut} />
            </>
          ) : (
            <>
              <p className="text-xl font-bold leading-8 text-ink">
                {t.notLoggedIn}
              </p>
              <Link
                href="/login?next=/account"
                className="mt-5 flex min-h-14 items-center justify-center rounded-full bg-trust-500 px-5 py-4 text-lg font-bold text-white shadow-soft"
              >
                {t.signIn}
              </Link>
            </>
          )}
        </div>
      </section>
      <FooterDisclaimer language={language} />
    </main>
  );
}
