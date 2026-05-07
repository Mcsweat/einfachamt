import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { TrustSignalList } from "@/components/TrustSignalList";
import { UploadCard } from "@/components/UploadCard";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";

export default async function UploadPage() {
  const language = await getLanguage();
  const t = copy[language];

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={t.uploadCta}
        backHref="/"
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
      />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-10 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          {t.uploadTitle}
        </h1>
        <p className="mt-4 text-xl leading-8 text-slate-700">
          {t.uploadIntro}
        </p>
        <div className="mt-7">
          <UploadCard language={language} />
        </div>
        <div className="mt-5 rounded-[1.4rem] bg-white/95 p-5 shadow-sm">
          <h2 className="text-xl font-bold text-ink">{t.safeUploadTitle}</h2>
          <p className="mt-2 text-base leading-7 text-slate-700">
            {t.safeUploadText}
          </p>
          <div className="mt-4">
            <TrustSignalList compact language={language} />
          </div>
        </div>
      </section>
      <FooterDisclaimer language={language} />
    </main>
  );
}
