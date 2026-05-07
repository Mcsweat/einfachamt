import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { LoadingRedirect } from "./LoadingRedirect";

type LoadingPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LoadingPage({ params }: LoadingPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader title="Brief wird gelesen" backHref="/upload" />
      <section className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-[430px] flex-col justify-center px-4 py-8">
        <div className="rounded-[2rem] bg-white/95 p-6 text-center shadow-soft">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.45rem] bg-trust-100 text-3xl font-bold text-trust-500">
            ...
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-ink">
            Dein Brief wird gelesen...
          </h1>
          <p className="mt-4 text-xl leading-8 text-slate-700">
            Wir bereiten jetzt die Erklärung vor. OCR und echte KI kommen im
            nächsten Schritt.
          </p>
        </div>
        <div className="mt-6">
          <LoadingSkeleton />
        </div>
      </section>
      <FooterDisclaimer />
      <LoadingRedirect id={id} />
    </main>
  );
}
