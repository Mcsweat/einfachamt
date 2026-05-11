import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { siteConfig } from "@/lib/site-config";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <div className="mt-3 space-y-2 text-base leading-7 text-slate-700">
        {children}
      </div>
    </section>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <span className="rounded bg-amber-100 px-2 py-0.5 text-sm font-bold text-amber-900">
      {label}
    </span>
  );
}

export default async function ImpressumPage() {
  const language = await getLanguage();
  const t = copy[language];
  const op = siteConfig.operator;
  const isDe = language === "de";

  const isCompany = Boolean(op.legalForm);

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={t.impressum}
        backHref="/"
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-10 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          {isDe ? "Impressum" : "Imprint"}
        </h1>
        <p className="mt-3 text-base text-slate-500">
          {isDe ? "Angaben gemäß § 5 TMG" : "Information according to § 5 TMG"}
        </p>

        <div className="mt-7 space-y-4">
          <Section title={isDe ? "Anbieter" : "Provider"}>
            {op.name ? (
              <>
                <p className="font-bold">
                  {op.name}
                  {op.legalForm ? ` ${op.legalForm}` : ""}
                </p>
                {op.street ? <p>{op.street}</p> : null}
                {op.zip || op.city ? (
                  <p>
                    {[op.zip, op.city].filter(Boolean).join(" ")}
                  </p>
                ) : null}
                <p>{op.country}</p>
              </>
            ) : (
              <p>
                <Placeholder
                  label={
                    isDe
                      ? "TODO: Name und vollständige Anschrift eintragen (lib/site-config.ts)"
                      : "TODO: enter full name and address (lib/site-config.ts)"
                  }
                />
              </p>
            )}
          </Section>

          <Section title={isDe ? "Kontakt" : "Contact"}>
            <p>
              {isDe ? "E-Mail: " : "Email: "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="font-bold text-trust-500 underline-offset-2 hover:underline"
              >
                {siteConfig.contactEmail}
              </a>
            </p>
            {op.phone ? (
              <p>
                {isDe ? "Telefon: " : "Phone: "}
                {op.phone}
              </p>
            ) : null}
          </Section>

          {isCompany && (op.registerCourt || op.registerNumber) ? (
            <Section
              title={
                isDe ? "Registereintrag" : "Commercial register entry"
              }
            >
              {op.registerCourt ? (
                <p>
                  {isDe ? "Registergericht: " : "Register court: "}
                  {op.registerCourt}
                </p>
              ) : null}
              {op.registerNumber ? (
                <p>
                  {isDe ? "Registernummer: " : "Register number: "}
                  {op.registerNumber}
                </p>
              ) : null}
            </Section>
          ) : null}

          {op.vatId ? (
            <Section title={isDe ? "Umsatzsteuer-ID" : "VAT ID"}>
              <p>
                {isDe
                  ? "Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: "
                  : "VAT identification number according to § 27a UStG: "}
                {op.vatId}
              </p>
            </Section>
          ) : null}

          <Section
            title={
              isDe
                ? "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV"
                : "Responsible for content according to § 18 (2) MStV"
            }
          >
            {op.name ? (
              <>
                <p>{op.name}</p>
                {op.street ? <p>{op.street}</p> : null}
                {op.zip || op.city ? (
                  <p>{[op.zip, op.city].filter(Boolean).join(" ")}</p>
                ) : null}
              </>
            ) : (
              <p>
                <Placeholder
                  label={
                    isDe
                      ? "TODO: identisch mit Anbieter, sobald oben hinterlegt"
                      : "TODO: same as provider once filled in above"
                  }
                />
              </p>
            )}
          </Section>

          <Section
            title={
              isDe ? "EU-Streitschlichtung" : "EU dispute resolution"
            }
          >
            <p>
              {isDe
                ? "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:"
                : "The European Commission provides a platform for online dispute resolution (ODR):"}{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-trust-500 underline-offset-2 hover:underline"
              >
                ec.europa.eu/consumers/odr
              </a>
              .
            </p>
            <p>
              {isDe
                ? "Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."
                : "We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board."}
            </p>
          </Section>

          <Section
            title={
              isDe
                ? "Haftung für Inhalte und Links"
                : "Liability for content and links"
            }
          >
            <p>
              {isDe
                ? "Inhalte unseres Angebots wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte verantwortlich. Wir sind nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen."
                : "The contents of our service have been created with the greatest care. However, we cannot guarantee the accuracy, completeness or timeliness of the content. As a service provider, we are responsible for our own content according to § 7 (1) TMG. We are not obliged to monitor third-party information that has been transmitted or stored."}
            </p>
            <p>
              {isDe
                ? "EinfachAmt ist kein offizieller Behördendienst und bietet keine Rechtsberatung. Bei ernsten rechtlichen Problemen bitte Sozialberatung oder Anwalt kontaktieren."
                : "EinfachAmt is not an official government service and does not provide legal advice. For serious legal issues, please contact social counseling or a lawyer."}
            </p>
          </Section>

          <Section
            title={isDe ? "Urheberrecht" : "Copyright"}
          >
            <p>
              {isDe
                ? "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung oder Verbreitung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors."
                : "The content and works created by the site operators on these pages are subject to German copyright law. Duplication, processing or distribution outside the limits of copyright require the written consent of the respective author."}
            </p>
          </Section>
        </div>
      </section>
      <FooterDisclaimer language={language} />
    </main>
  );
}
