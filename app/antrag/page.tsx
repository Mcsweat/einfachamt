import Link from "next/link";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { getCurrentUserAntragSubscription } from "@/lib/subscription";
import { getSafeUser } from "@/lib/supabase/safe-auth";
import { AntragWizard } from "./AntragWizard";
import { AntragCheckoutButton } from "./AntragCheckoutButton";

type AntragPageProps = {
  searchParams?: Promise<{ checkout?: string }>;
};

export default async function AntragPage({ searchParams }: AntragPageProps) {
  const params = await searchParams;
  const language = await getLanguage();
  const t = copy[language];
  const ta = t.antrag;
  const isDe = language === "de";

  const [subscription, user] = await Promise.all([
    getCurrentUserAntragSubscription(),
    getSafeUser(),
  ]);

  const isLoggedIn = Boolean(user && !user.is_anonymous);
  const hasAccess = subscription.isPaid;

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={ta.title}
        backHref="/"
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />

      <section className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">

        {/* Checkout feedback banners */}
        {params?.checkout === "success" && (
          <p className="mb-5 rounded-[1.25rem] bg-emerald-50 p-4 text-base font-bold leading-6 text-emerald-800">
            {isDe ? "Zugang aktiviert — du kannst jetzt starten!" : "Access activated — you can start now!"}
          </p>
        )}
        {params?.checkout === "cancelled" && (
          <p className="mb-5 rounded-[1.25rem] bg-amber-50 p-4 text-base font-bold leading-6 text-amber-900">
            {isDe ? "Checkout abgebrochen. Kein Geld wurde abgebucht." : "Checkout cancelled. No charge was made."}
          </p>
        )}

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-trust-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-trust-700">
            {isDe ? "Antragsservice" : "Application Service"}
          </span>
          <span className="text-xs font-bold text-slate-500">HA · April 2026</span>
        </div>

        <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">{ta.title}</h1>
        <p className="mt-3 text-lg leading-7 text-slate-700">{ta.intro}</p>

        {hasAccess ? (
          <div className="mt-7">
            <AntragWizard language={language} />
          </div>
        ) : (
          <div className="mt-7 space-y-4">

            {/* Feature list */}
            <div className="overflow-hidden rounded-[1.55rem] bg-white/95 shadow-sm">
              {[
                { icon: "📋", de: "Offizielles Formular (HA) automatisch ausfüllen", en: "Fills the official form (HA) automatically" },
                { icon: "🌍", de: "Fragen in 6 Sprachen", en: "Questions in 6 languages" },
                { icon: "⚡", de: "Fertig in unter 5 Minuten", en: "Done in under 5 minutes" },
                { icon: "📄", de: "PDF sofort herunterladen, ausdrucken & einreichen", en: "Download, print & submit instantly" },
                { icon: "🔄", de: "Unbegrenzte Nutzung", en: "Unlimited use" },
              ].map((item) => (
                <div key={item.icon} className="flex items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-sm font-semibold text-slate-700">{isDe ? item.de : item.en}</p>
                </div>
              ))}
            </div>

            {/* Price card */}
            <div className="overflow-hidden rounded-[1.55rem] bg-trust-500 p-5 shadow-soft">
              <p className="text-sm font-bold text-white/70">
                {isDe ? "Antragsservice" : "Application Service"}
              </p>
              <p className="mt-1 text-4xl font-black text-white">39,99 €</p>
              <p className="text-base font-semibold text-white/70">
                {isDe ? "pro Monat · jederzeit kündbar" : "per month · cancel anytime"}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/85">
                {isDe
                  ? "Für alle, die regelmäßig Bürgergeld-Anträge oder Widersprüche stellen."
                  : "For everyone who regularly needs to file Bürgergeld applications or appeals."}
              </p>
            </div>

            {/* Checkout CTA */}
            <AntragCheckoutButton
              isLoggedIn={isLoggedIn}
              ctaLabel={isDe ? "Jetzt für 39,99 €/Monat starten →" : "Start for €39.99/month →"}
              loadingLabel={isDe ? "Weiter..." : "Continue..."}
              errorLabel={isDe ? "Checkout konnte nicht gestartet werden." : "Could not start checkout."}
            />

            <Link
              href="/upload"
              className="flex min-h-12 items-center justify-center rounded-full bg-trust-100 px-5 text-center text-base font-bold text-trust-700 transition active:scale-[0.98]"
            >
              {t.startFree}
            </Link>

            {/* Trust note */}
            <p className="text-center text-xs text-slate-400">
              {isDe
                ? "Zahlung via Stripe · Jederzeit kündbar · DSGVO-konform"
                : "Powered by Stripe · Cancel anytime · GDPR compliant"}
            </p>
          </div>
        )}
      </section>

      <FooterDisclaimer language={language} />
    </main>
  );
}
