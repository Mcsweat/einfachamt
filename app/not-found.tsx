import Link from "next/link";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";

export default async function NotFound() {
  const language = await getLanguage();
  const t = copy[language];

  return (
    <main className="min-h-svh bg-trust-50">
      <section className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col items-center justify-center px-4 pb-8 pt-8">
        <div className="w-full rounded-[1.55rem] bg-white/95 p-6 shadow-soft text-center">
          <p className="text-7xl font-black text-trust-500 leading-none">404</p>
          <p className="mt-3 text-4xl" aria-hidden="true">😕</p>
          <h1 className="mt-4 text-2xl font-bold leading-tight text-ink">
            {t.notFoundTitle ?? "Seite nicht gefunden"}
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            {t.notFoundText ?? "Diese Seite gibt es leider nicht."}
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-trust-500 px-6 py-3 text-center font-bold text-white shadow-soft"
            >
              {t.notFoundCta ?? "Zur Startseite"}
            </Link>
          </div>
        </div>
      </section>
      <FooterDisclaimer language={language} />
    </main>
  );
}
