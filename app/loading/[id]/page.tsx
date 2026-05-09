import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { LoadingRedirect } from "./LoadingRedirect";

type LoadingPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LoadingPage({ params }: LoadingPageProps) {
  const { id } = await params;
  const language = await getLanguage();
  const t = copy[language];

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={t.loadingHeader}
        backHref="/upload"
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />
      <section className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-[430px] flex-col justify-center px-4 py-8">
        <div className="rounded-[2rem] bg-white/95 p-6 text-center shadow-soft">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.45rem] bg-trust-100 text-3xl font-bold text-trust-500">
            ...
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-ink">
            {t.loadingTitle}
          </h1>
        </div>
        <section className="mt-6 rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
          <div className="space-y-4">
            {t.loadingSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-trust-100 text-base font-black text-trust-600"
                >
                  {index + 1}
                </span>
                <span className="text-lg font-bold leading-7 text-ink">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </section>
        <div className="mt-6">
          <LoadingSkeleton />
        </div>
      </section>
      <FooterDisclaimer language={language} />
      <LoadingRedirect id={id} errorText={t.readError} />
    </main>
  );
}
