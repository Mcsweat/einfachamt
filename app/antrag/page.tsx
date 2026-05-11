import Link from "next/link";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { getCurrentUserSubscription } from "@/lib/subscription";
import { AntragWizard } from "./AntragWizard";

export default async function AntragPage() {
  const language = await getLanguage();
  const t = copy[language];
  const ta = t.antrag;
  const subscription = await getCurrentUserSubscription();
  const isPlus = subscription.isPaid;

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
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-trust-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-trust-700">
            Plus
          </span>
          <span className="text-xs font-bold text-slate-500">Bürgergeld HA — April 2026</span>
        </div>

        <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">{ta.title}</h1>
        <p className="mt-3 text-lg leading-7 text-slate-700">{ta.intro}</p>

        {isPlus ? (
          <div className="mt-7">
            <AntragWizard language={language} />
          </div>
        ) : (
          /* ── Plus gate ── */
          <div className="mt-7 space-y-4">
            <div className="overflow-hidden rounded-[1.55rem] bg-white/95 shadow-sm">
              {/* Feature list */}
              {[
                { icon: "📋", text: language === "de" ? "Offizielles Formular (HA) wird automatisch ausgefüllt" : "Official form (HA) filled automatically" },
                { icon: "🌍", text: language === "de" ? "Fragen in 6 Sprachen" : "Questions in 6 languages" },
                { icon: "🔒", text: language === "de" ? "Daten verlassen nie dein Gerät unverschlüsselt" : "Data never leaves your device unencrypted" },
                { icon: "📄", text: language === "de" ? "PDF sofort herunterladen — ausdrucken und einreichen" : "Download PDF instantly — print and submit" },
              ].map((item) => (
                <div key={item.icon} className="flex items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-sm font-semibold text-slate-700">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[1.55rem] bg-amber-50 p-5">
              <p className="text-base font-bold text-amber-900">{ta.plusOnly}</p>
            </div>

            <Link
              href="/pricing"
              className="flex min-h-14 items-center justify-center rounded-full bg-trust-500 px-5 text-center text-lg font-bold text-white shadow-soft transition active:scale-[0.98]"
            >
              {ta.plusCta} →
            </Link>
            <Link
              href="/upload"
              className="flex min-h-14 items-center justify-center rounded-full bg-trust-100 px-5 text-center text-base font-bold text-trust-700 transition active:scale-[0.98]"
            >
              {t.startFree}
            </Link>
          </div>
        )}
      </section>

      <FooterDisclaimer language={language} />
    </main>
  );
}
