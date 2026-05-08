import Link from "next/link";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { SimpleListCard } from "@/components/SimpleListCard";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  const language = await getLanguage();
  const t = copy[language];
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isEmailUser = Boolean(user && !user.is_anonymous);

  return (
    <main className="min-h-svh bg-trust-50">
      <section className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col px-4 pb-28 pt-8">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" aria-label="EinfachAmt Startseite">
            <Logo />
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={isEmailUser ? "/account" : "/login?next=/account"}
              className="flex min-h-10 items-center justify-center rounded-full bg-white/90 px-3 text-sm font-bold text-trust-700 shadow-sm"
            >
              {isEmailUser ? t.account : t.login}
            </Link>
            <LanguageToggle active={language} label={t.languageLabel} />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center py-9">
          <p className="mb-4 inline-flex w-fit rounded-full bg-white/90 px-4 py-2 text-base font-semibold text-trust-500 shadow-sm">
            {t.heroEyebrow}
          </p>
          <h1 className="text-[44px] font-bold leading-[1.04] tracking-normal text-ink">
            {t.heroTitle}
          </h1>
          <p className="mt-6 text-xl leading-8 text-slate-700">
            {t.heroSubtitle}
          </p>
          <div className="mt-7 grid gap-3">
            <Link
              href="/upload"
              className="flex min-h-16 w-full items-center justify-center rounded-full bg-trust-500 px-6 py-5 text-center text-xl font-bold text-white shadow-soft transition hover:bg-trust-700 active:scale-[0.98]"
            >
              {t.uploadCta}
            </Link>
            <Link
              href="/dashboard"
              className="flex min-h-14 w-full items-center justify-center rounded-full bg-trust-100 px-6 py-4 text-center text-lg font-bold text-trust-700 transition active:scale-[0.98]"
            >
              {t.dashboardCta}
            </Link>
          </div>
        </div>

        <section className="rounded-[1.65rem] bg-white/95 p-5 shadow-sm">
          <h2 className="text-2xl font-bold text-ink">{t.howItWorks}</h2>
          <div className="mt-5 space-y-4">
            {t.steps.map(([title, text], index) => (
              <article key={title} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-trust-100 text-lg font-black text-trust-500">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-[21px] font-bold leading-7 text-ink">
                    {title}
                  </h3>
                  <p className="mt-1 text-[17px] leading-7 text-slate-700">
                    {text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-5">
          <SimpleListCard title={t.helpsTitle} items={[...t.helpAreas]} />
        </div>

        <div className="mt-5">
          <SimpleListCard title={t.trustTitle} items={[...t.trustItems]} />
        </div>

        <section className="mt-5 rounded-[1.65rem] bg-white/95 p-5 shadow-sm">
          <h2 className="text-2xl font-bold text-ink">{t.pricingTitle}</h2>
          <p className="mt-2 text-lg leading-7 text-slate-700">
            {t.pricingText}
          </p>
          <Link
            href="/pricing"
            className="mt-4 inline-flex min-h-12 items-center rounded-full bg-trust-100 px-5 py-3 text-base font-bold text-trust-700"
          >
            {t.pricingLink}
          </Link>
        </section>
      </section>

      <FooterDisclaimer language={language} />
    </main>
  );
}
