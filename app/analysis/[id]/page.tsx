import Link from "next/link";
import { AnalysisCard } from "@/components/AnalysisCard";
import { AnalysisSourceBadge } from "@/components/AnalysisSourceBadge";
import { BottomActionBar } from "@/components/BottomActionBar";
import { DeadlineWarning } from "@/components/DeadlineWarning";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { TodoChecklist } from "@/components/TodoChecklist";
import { TrustSignalList } from "@/components/TrustSignalList";
import { getAnalysisForDocument } from "@/lib/document-data";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";

type AnalysisPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { id } = await params;
  const language = await getLanguage();
  const t = copy[language];
  const analysis = await getAnalysisForDocument(id);

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={t.analysisHeader}
        backHref="/upload"
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">
        <AnalysisSourceBadge
          documentId={id}
          initialSource={analysis.source}
          labels={t.analysisSourceLabels}
        />
        <h1 className="mt-2 text-4xl font-bold leading-tight text-ink">
          {t.analysisTitle}
        </h1>
        <p className="mt-4 text-xl leading-8 text-slate-700">
          {t.analysisIntro}
        </p>

        <div className="mt-7 space-y-4">
          <AnalysisCard title={t.shortSaid} icon="i">
            <p>{analysis.summary}</p>
          </AnalysisCard>

          <AnalysisCard title={t.authorityWants} icon="?">
            <p>{analysis.authorityRequest}</p>
          </AnalysisCard>

          <DeadlineWarning
            deadline={analysis.deadlines[0]}
            title={t.importantDeadline}
            hint={t.deadlineHint}
          />

          <TodoChecklist todos={analysis.todos} title={t.todosTitle} />

          <AnalysisCard title={t.riskTitle} icon="!">
            <p>{analysis.risks}</p>
          </AnalysisCard>

          <section className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
            <h2 className="text-xl font-bold text-ink">{t.important}</h2>
            <p className="mt-2 text-base leading-7 text-slate-700">
              {t.disclaimer}
            </p>
          </section>

          <TrustSignalList compact language={language} />
        </div>
      </section>
      <FooterDisclaimer language={language} />

      <BottomActionBar>
        <Link
          href={`/response/${id}`}
          className="flex min-h-14 items-center justify-center rounded-full bg-trust-500 px-5 py-4 text-center text-[17px] font-bold text-white shadow-soft transition hover:bg-trust-700 active:scale-[0.98]"
        >
          {t.createResponse}
        </Link>
      </BottomActionBar>
    </main>
  );
}
