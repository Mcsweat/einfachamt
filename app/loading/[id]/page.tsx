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

        {/* Animated icon */}
        <div className="animate-fade-in-up flex flex-col items-center text-center">
          <div className="animate-pulse-ring flex h-24 w-24 items-center justify-center rounded-[1.6rem] bg-trust-500 shadow-soft">
            <span className="text-4xl">📋</span>
          </div>
          <h1 className="mt-6 text-3xl font-bold leading-tight text-ink">
            {t.loadingTitle}
          </h1>
          <p className="mt-2 text-base text-slate-500">
            {language === "de"
              ? "Das dauert in der Regel 10–20 Sekunden."
              : "This usually takes 10–20 seconds."}
          </p>
        </div>

        {/* Animated steps */}
        <section className="mt-8 rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
          <div className="space-y-4">
            {t.loadingSteps.map((step, index) => (
              <div
                key={step}
                className="animate-fade-in-up flex items-center gap-3"
                style={{ animationDelay: `${0.3 + index * 0.5}s` }}
              >
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-trust-100 text-base font-black text-trust-500"
                >
                  {index + 1}
                </span>
                <span className="text-lg font-bold leading-7 text-ink">
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-trust-100">
            <div
              className="h-full rounded-full bg-trust-500"
              style={{
                width: "100%",
                animation: "progressBar 20s linear forwards",
              }}
            />
          </div>
        </section>

      </section>

      <style>{`
        @keyframes progressBar {
          from { width: 0%; }
          to { width: 90%; }
        }
      `}</style>

      <FooterDisclaimer language={language} />
      <LoadingRedirect id={id} errorText={t.readError} />
    </main>
  );
}
