import Link from "next/link";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { WiderspruchWizard } from "./WiderspruchWizard";

export default async function WiderspruchPage() {
  const language = await getLanguage();
  const t = copy[language];
  const isDe = language === "de";

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={t.widerspruchTitle}
        backHref="/"
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-800">
            {isDe ? "Kostenlos" : "Free"}
          </span>
        </div>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">
          {t.widerspruchTitle}
        </h1>
        <p className="mt-3 text-lg leading-7 text-slate-700">{t.widerspruchIntro}</p>

        {/* Info box */}
        <div className="mt-5 rounded-[1.2rem] bg-amber-50 p-4">
          <p className="text-sm font-semibold leading-6 text-amber-900">
            {isDe
              ? "⏰ Wichtig: Ein Widerspruch muss in der Regel innerhalb von einem Monat nach Erhalt des Bescheids eingereicht werden."
              : "⏰ Important: An appeal must generally be filed within one month of receiving the decision."}
          </p>
        </div>

        <div className="mt-7">
          <WiderspruchWizard language={language} />
        </div>

        {/* Analyse-Tipp */}
        <div className="mt-6 rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
          <p className="text-base font-bold text-ink">
            {isDe ? "Brief noch nicht analysiert?" : "Haven't analysed your letter yet?"}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {isDe
              ? "Lade deinen Bescheid hoch — EinfachAmt erklärt dir genau, worum es geht, und hilft dir beim Widerspruch."
              : "Upload your notice — EinfachAmt explains exactly what it means and helps you with the appeal."}
          </p>
          <Link
            href="/upload"
            className="mt-4 flex min-h-11 items-center justify-center rounded-full bg-trust-500 px-5 text-sm font-bold text-white shadow-soft transition active:scale-[0.98]"
          >
            {t.uploadCta} →
          </Link>
        </div>
      </section>
      <FooterDisclaimer language={language} />
    </main>
  );
}
