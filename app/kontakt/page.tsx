import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";

const CONTACT_EMAIL = "Einfachamt@gmail.com";

export async function generateMetadata() {
  const language = await getLanguage();
  const isDe = language === "de";
  const title = isDe
    ? "Kontakt | EinfachAmt"
    : "Contact | EinfachAmt";
  const description = isDe
    ? "Fragen oder Probleme? Schreib uns — wir antworten so schnell wie möglich."
    : "Questions or problems? Send us an email — we'll reply as soon as possible.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://einfachamt.com/kontakt",
      siteName: "EinfachAmt",
      locale: isDe ? "de_DE" : "en_GB",
    },
  };
}

export default async function KontaktPage() {
  const language = await getLanguage();
  const t = copy[language];

  const title = t.kontaktTitle ?? "Kontakt";
  const intro = t.kontaktIntro ?? "Bei Fragen oder Problemen schreib uns — wir antworten so schnell wie möglich.";
  const emailLabel = t.kontaktEmailLabel ?? "E-Mail schreiben";

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={title}
        backHref="/"
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-10 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">{title}</h1>
        <p className="mt-4 text-lg leading-7 text-slate-700">{intro}</p>

        <div className="mt-7 space-y-4">
          {/* Email card */}
          <section className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">✉️</span>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex flex-1 items-center justify-center rounded-full bg-trust-500 px-5 py-3 text-center font-bold text-white shadow-soft transition-opacity hover:opacity-90"
              >
                {emailLabel}
              </a>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              EinfachAmt ist kein offizieller Behördendienst.
            </p>
          </section>

          {/* Response time card */}
          <section className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
            <p className="text-base leading-7 text-slate-700">
              Wir antworten in der Regel innerhalb von 24–48 Stunden.
            </p>
          </section>
        </div>
      </section>
      <FooterDisclaimer language={language} />
    </main>
  );
}
