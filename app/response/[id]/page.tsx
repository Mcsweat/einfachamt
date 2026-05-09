import { MobileHeader } from "@/components/MobileHeader";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { createClient } from "@/lib/supabase/server";
import { extractLetterSignals, type LetterSignals } from "@/lib/knowledge-base";
import { ResponseDraftClient } from "./ResponseDraftClient";

type ResponsePageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function loadSignalsFor(documentId: string): Promise<LetterSignals> {
  if (documentId === "mock-upload" || documentId.startsWith("demo-")) {
    return {};
  }
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("documents")
      .select("extracted_text")
      .eq("id", documentId)
      .maybeSingle();
    if (!data?.extracted_text) {
      return {};
    }
    return extractLetterSignals(data.extracted_text);
  } catch {
    return {};
  }
}

export default async function ResponsePage({ params }: ResponsePageProps) {
  const { id } = await params;
  const language = await getLanguage();
  const t = copy[language];
  const signals = await loadSignalsFor(id);

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
          <ResponseDraftClient
            language={language}
            documentId={id}
            signals={signals}
          />
        </div>
      </section>
      <FooterDisclaimer language={language} />
    </main>
  );
}
