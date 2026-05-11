import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { siteConfig } from "@/lib/site-config";

export default async function KontaktPage() {
  const language = await getLanguage();
  const t = copy[language];
  const isDe = language === "de";

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={t.contact}
        backHref="/"
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-10 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          {isDe ? "Kontakt" : "Contact"}
        </h1>
        <p className="mt-4 text-lg leading-7 text-slate-700">
          {isDe
            ? "Du hast eine Frage, ein Problem oder einen Vorschlag? Schreib uns kurz — wir antworten persönlich."
            : "Do you have a question, a problem, or a suggestion? Drop us a line — we reply personally."}
        </p>

        <div className="mt-7 space-y-4">
          <section className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
            <p className="text-base font-bold text-slate-500">
              {isDe ? "E-Mail" : "Email"}
            </p>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="mt-1 block break-all text-xl font-bold text-trust-500 underline-offset-2 hover:underline"
            >
              {siteConfig.contactEmail}
            </a>
            <p className="mt-3 text-sm text-slate-500">
              {isDe
                ? "Antwortzeit: in der Regel innerhalb von 1–2 Werktagen"
                : "Response time: usually within 1–2 business days"}
            </p>
          </section>

          <section className="rounded-[1.55rem] bg-amber-50 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-amber-900">
              {isDe
                ? "Bitte keine Briefe per E-Mail senden"
                : "Please don't send letters by email"}
            </h2>
            <p className="mt-2 text-base leading-7 text-amber-900">
              {isDe
                ? "Aus Datenschutzgründen analysieren wir Briefe nur über den sicheren Upload in der App. Briefe, die per E-Mail eingehen, können wir nicht bearbeiten."
                : "For privacy reasons, we only analyse letters through the secure upload in the app. We cannot process letters sent by email."}
            </p>
          </section>

          <section className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-ink">
              {isDe ? "Was wir nicht sind" : "What we are not"}
            </h2>
            <p className="mt-2 text-base leading-7 text-slate-700">
              {isDe
                ? "EinfachAmt ist kein offizieller Behördendienst und bietet keine Rechtsberatung. Für rechtliche Fragen wende dich bitte an eine Sozialberatung oder einen Anwalt."
                : "EinfachAmt is not an official government service and does not provide legal advice. For legal questions, please contact social counselling or a lawyer."}
            </p>
          </section>
        </div>
      </section>
      <FooterDisclaimer language={language} />
    </main>
  );
}
