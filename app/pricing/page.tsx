import Link from "next/link";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { getSafeUser } from "@/lib/supabase/safe-auth";
import { PricingCheckoutButton } from "./PricingCheckoutButton";

type PricingPageProps = {
  searchParams?: Promise<{
    checkout?: string;
  }>;
};

const comparisonRows = (isDe: boolean) => [
  {
    feature: isDe ? "Briefe pro Monat" : "Letters per month",
    free: isDe ? "1 (Foto)" : "1 (photo)",
    plus: "50",
  },
  {
    feature: isDe ? "Erklärung in einfacher Sprache" : "Plain-language explanation",
    free: true,
    plus: true,
  },
  {
    feature: isDe ? "Antwortentwurf" : "Reply draft",
    free: true,
    plus: true,
  },
  {
    feature: isDe ? "PDF-Upload" : "PDF upload",
    free: false,
    plus: true,
  },
  {
    feature: isDe ? "Echte Texterkennung (OCR)" : "Real text recognition (OCR)",
    free: false,
    plus: true,
  },
  {
    feature: isDe ? "Briefe gespeichert & abrufbar" : "Letters saved & accessible",
    free: false,
    plus: true,
  },
  {
    feature: isDe ? "E-Mail nach Analyse" : "Email after analysis",
    free: false,
    plus: true,
  },
  {
    feature: isDe ? "Kein Konto nötig" : "No account needed",
    free: true,
    plus: false,
  },
];

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return (
      <span className="text-sm font-bold text-slate-700">{value}</span>
    );
  }
  return value ? (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
      ✓
    </span>
  ) : (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-400">
      —
    </span>
  );
}

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const params = await searchParams;
  const checkout = params?.checkout;
  const language = await getLanguage();
  const t = copy[language];
  const isDe = language === "de";
  const user = await getSafeUser();
  const isLoggedIn = Boolean(user && !user.is_anonymous);
  const rows = comparisonRows(isDe);

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={t.pricing}
        backHref="/"
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          {t.pricingPageTitle}
        </h1>
        <p className="mt-3 text-lg leading-7 text-slate-700">
          {t.pricingPageIntro}
        </p>

        {checkout === "success" ? (
          <p className="mt-5 rounded-[1.25rem] bg-emerald-50 p-4 text-base font-bold leading-6 text-emerald-800">
            {t.checkoutSuccess}
          </p>
        ) : null}

        {checkout === "cancelled" ? (
          <p className="mt-5 rounded-[1.25rem] bg-amber-50 p-4 text-base font-bold leading-6 text-amber-900">
            {t.checkoutCancelled}
          </p>
        ) : null}

        {/* Plan cards */}
        <div className="mt-7 grid grid-cols-2 gap-3">
          {/* Free */}
          <article className="rounded-[1.5rem] bg-white/95 p-4 shadow-sm">
            <p className="text-sm font-bold text-slate-500">{t.plans.free.name}</p>
            <p className="mt-1 text-3xl font-black text-ink">{t.plans.free.price}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t.plans.free.description}</p>
          </article>

          {/* Plus — highlighted */}
          <article className="relative rounded-[1.5rem] bg-trust-500 p-4 shadow-sm">
            <span className="absolute -top-2.5 right-4 rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-black text-amber-900">
              {isDe ? "Beliebt" : "Popular"}
            </span>
            <p className="text-sm font-bold text-white/80">{t.plans.plus.name}</p>
            <p className="mt-1 text-3xl font-black text-white">{t.plans.plus.price}</p>
            <p className="mt-2 text-sm leading-6 text-white/85">{t.plans.plus.description}</p>
          </article>
        </div>

        {/* Comparison table */}
        <section className="mt-4 overflow-hidden rounded-[1.55rem] bg-white/95 shadow-sm">
          <div className="grid grid-cols-[1fr_auto_auto] border-b border-slate-100 px-4 py-2.5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              {isDe ? "Funktion" : "Feature"}
            </p>
            <p className="w-14 text-center text-xs font-bold uppercase tracking-wide text-slate-400">
              {isDe ? "Gratis" : "Free"}
            </p>
            <p className="w-14 text-center text-xs font-bold uppercase tracking-wide text-trust-500">
              Plus
            </p>
          </div>
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1fr_auto_auto] items-center px-4 py-3 ${
                i < rows.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              <p className="text-sm font-semibold text-slate-700">{row.feature}</p>
              <div className="flex w-14 justify-center">
                <Cell value={row.free} />
              </div>
              <div className="flex w-14 justify-center">
                <Cell value={row.plus} />
              </div>
            </div>
          ))}
        </section>

        {/* CTAs */}
        <div className="mt-6 space-y-3">
          <PricingCheckoutButton isLoggedIn={isLoggedIn} language={language} />

          <Link
            href="/upload"
            className="flex min-h-14 items-center justify-center rounded-full bg-trust-100 px-5 py-4 text-center text-lg font-bold text-trust-700"
          >
            {t.startFree}
          </Link>
        </div>

        {/* Trust line */}
        <p className="mt-5 text-center text-sm text-slate-500">
          {isDe
            ? "Zahlung via Stripe · Jederzeit kündbar · DSGVO-konform"
            : "Powered by Stripe · Cancel anytime · GDPR compliant"}
        </p>
      </section>
      <FooterDisclaimer language={language} />
    </main>
  );
}
