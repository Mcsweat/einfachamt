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
      <section className="flex flex-wrap justify-center gap-4 text-sm font-bold text-trust-500">
        <Link href="/faq">{t.faqTitle}</Link>
        <Link href="/widerspruch">{language === "de" ? "Widerspruch" : "Appeal"}</Link>
        <Link href="/pricing">{t.pricing}</Link>
        <Link href="/kontakt">{t.contact}</Link>
        <Link href="/impressum">{t.impressum}</Link>
        <Link href="/datenschutz">{language === "de" ? "Datenschutz" : "Privacy"}</Link>
      </section>
    </footer>
  );
}
