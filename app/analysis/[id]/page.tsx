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

type AnalysisPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { id } = await params;
  const analysis = await getAnalysisForDocument(id);

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader title="Ergebnis" backHref="/upload" />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">
        <AnalysisSourceBadge documentId={id} initialSource={analysis.source} />
        <h1 className="mt-2 text-4xl font-bold leading-tight text-ink">
          Das ist wichtig
        </h1>
        <p className="mt-4 text-xl leading-8 text-slate-700">
          Kurz und einfach. Danach kannst du direkt eine Antwort erstellen.
        </p>

        <div className="mt-7 space-y-4">
          <AnalysisCard title="Kurz gesagt" icon="i">
            <p>{analysis.summary}</p>
          </AnalysisCard>

          <AnalysisCard title="Was möchte das Amt?" icon="?">
            <p>{analysis.authorityRequest}</p>
          </AnalysisCard>

          <DeadlineWarning deadline={analysis.deadlines[0]} />

          <TodoChecklist todos={analysis.todos} />

          <AnalysisCard title="Risiko, wenn du nicht reagierst" icon="!">
            <p>{analysis.risks}</p>
          </AnalysisCard>

          <section className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
            <h2 className="text-xl font-bold text-ink">Wichtig</h2>
            <p className="mt-2 text-base leading-7 text-slate-700">
              EinfachAmt ist kein offizieller Behördendienst und bietet keine
              Rechtsberatung.
            </p>
          </section>

          <TrustSignalList compact />
        </div>
      </section>
      <FooterDisclaimer />

      <BottomActionBar>
        <Link
          href={`/response/${id}`}
          className="flex min-h-14 items-center justify-center rounded-full bg-trust-500 px-5 py-4 text-center text-[17px] font-bold text-white shadow-soft transition hover:bg-trust-700 active:scale-[0.98]"
        >
          Antwort erstellen
        </Link>
      </BottomActionBar>
    </main>
  );
}
