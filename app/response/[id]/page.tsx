import { MobileHeader } from "@/components/MobileHeader";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { ResponseDraftClient } from "./ResponseDraftClient";

type ResponsePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ResponsePage({ params }: ResponsePageProps) {
  const { id } = await params;

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader title="Antwort" backHref={`/analysis/${id}`} />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-32 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          Was möchtest du sagen?
        </h1>
        <p className="mt-4 text-xl leading-8 text-slate-700">
          Wähle eine Vorlage. Du kannst alles ändern.
        </p>
        <div className="mt-7">
          <ResponseDraftClient />
        </div>
      </section>
      <FooterDisclaimer />
    </main>
  );
}
