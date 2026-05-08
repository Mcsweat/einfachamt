import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";

export default async function PrivacyPage() {
  const language = await getLanguage();
  const t = copy[language];

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={t.privacy}
        backHref="/"
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-10 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          {t.privacyTitle}
        </h1>
        <div className="mt-7 space-y-4">
          {t.privacyCards.map(([title, text]) => (
            <section
              key={title}
              className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-ink">{title}</h2>
              <p className="mt-3 text-lg leading-8 text-slate-700">{text}</p>
            </section>
          ))}
        </div>
      </section>
      <FooterDisclaimer language={language} />
    </main>
  );
}
