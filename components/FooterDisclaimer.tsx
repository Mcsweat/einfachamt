import Link from "next/link";
import { copy, type Language } from "@/lib/i18n";

export const disclaimerText =
  "EinfachAmt ist kein offizieller Behördendienst und bietet keine Rechtsberatung.";

type FooterDisclaimerProps = {
  language?: Language;
};

export function FooterDisclaimer({ language = "de" }: FooterDisclaimerProps) {
  const t = copy[language];

  return (
    <footer className="mx-auto w-full max-w-[430px] px-4 pb-8">
      <section className="rounded-[1.4rem] bg-white/70 p-5">
        <p className="text-base font-bold leading-7 text-ink">{t.disclaimer}</p>
        <p className="mt-2 text-base leading-7 text-slate-700">{t.legalHelp}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-trust-500">
          <Link href="/privacy">{t.privacy}</Link>
          <Link href="/impressum">{t.impressum}</Link>
          <Link href="/pricing">{t.pricing}</Link>
        </div>
      </section>
    </footer>
  );
}
