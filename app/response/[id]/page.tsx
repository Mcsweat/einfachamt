import { MobileHeader } from "@/components/MobileHeader";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { ResponseDraftClient } from "./ResponseDraftClient";

type ResponsePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ResponsePage({ params }: ResponsePageProps) {
  const { id } = await params;
  const language = await getLanguage();
  const t = copy[language];

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={t.responseHeader}
        backHref={`/analysis/${id}`}
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-32 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          {t.responseTitle}
        </h1>
        <p className="mt-4 text-xl leading-8 text-slate-700">
          {t.responseIntro}
        </p>
        <div className="mt-7">
          <ResponseDraftClient language={language} />
        </div>
      </section>
      <FooterDisclaimer language={language} />
    </main>
  );
}
