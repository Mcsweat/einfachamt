import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { ogImage } from "@/lib/og";
import { faqData } from "@/lib/faqData";

export async function generateMetadata() {
  const language = await getLanguage();
  const isDe = language === "de";
  const title = isDe
    ? "Häufige Fragen | EinfachAmt"
    : "FAQ | EinfachAmt";
  const description = isDe
    ? "Antworten auf die häufigsten Fragen zu EinfachAmt, Datenschutz, Kosten und Bürgergeld."
    : "Answers to the most common questions about EinfachAmt, privacy, pricing and Bürgergeld.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://einfachamt.com/faq",
      siteName: "EinfachAmt",
      locale: isDe ? "de_DE" : "en_GB",
      images: ogImage,
    },
  };
}

export default async function FaqPage() {
  const language = await getLanguage();
  const t = copy[language];
  const items = faqData[language];

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={t.faqTitle}
        backHref="/"
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">{t.faqTitle}</h1>
        <p className="mt-3 text-lg leading-7 text-slate-700">{t.faqIntro}</p>

        <div className="mt-7 space-y-3">
          {items.map((item, i) => (
            <details
              key={i}
              className="group overflow-hidden rounded-[1.55rem] bg-white/95 shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-trust-100 text-xs font-black text-trust-700">
                  {i + 1}
                </span>
                <span className="flex-1 text-base font-bold text-ink">{item.q}</span>
                <span className="shrink-0 text-lg text-slate-300 transition-transform group-open:rotate-90">
                  ›
                </span>
              </summary>
              <div className="border-t border-slate-100 px-5 py-4">
                <p className="text-base leading-7 text-slate-700">{item.a}</p>
              </div>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-[1.55rem] bg-trust-500 p-5 text-center">
          <p className="text-base font-bold text-white">
            {language === "de" ? "Noch Fragen?" : "Still have questions?"}
          </p>
          <a
            href="mailto:Einfachamt@gmail.com"
            className="mt-3 inline-flex min-h-11 items-center rounded-full bg-white px-5 text-sm font-bold text-trust-700 transition active:scale-95"
          >
            Einfachamt@gmail.com
          </a>
        </div>
      </section>
      <FooterDisclaimer language={language} />
    </main>
  );
}
