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
      <div className="mt-3 space-y-3 text-base leading-7 text-slate-700">
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

export default async function PrivacyPage() {
  const language = await getLanguage();
  const t = copy[language];
  const isDe = language === "de";
  const op = siteConfig.operator;

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={t.privacy}
        backHref="/"
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-10 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          {isDe ? "Datenschutzerklärung" : "Privacy Policy"}
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          {isDe ? "Stand: " : "Last updated: "}
          {siteConfig.privacyLastUpdated}
        </p>

        <div className="mt-7 space-y-4">
          <Section title={isDe ? "Kurz und klar" : "In short"}>
            <p>
              {isDe
                ? "EinfachAmt hilft dir, Behördenbriefe zu verstehen. Wir speichern deine hochgeladenen Briefe geschützt, nutzen sie ausschließlich für die Analyse und geben sie nicht an Dritte weiter. Du kannst deine Daten jederzeit löschen."
                : "EinfachAmt helps you understand official letters. We store your uploaded letters securely, use them only for analysis, and never share them with third parties. You can delete your data at any time."}
            </p>
          </Section>

          <Section
            title={isDe ? "1. Verantwortlicher" : "1. Data controller"}
          >
            {op.name ? (
              <>
                <p>
                  {op.name}
                  {op.legalForm ? ` ${op.legalForm}` : ""}
                </p>
                {op.street ? <p>{op.street}</p> : null}
                {op.zip || op.city ? (
                  <p>{[op.zip, op.city].filter(Boolean).join(" ")}</p>
                ) : null}
                <p>{op.country}</p>
              </>
            ) : (
              <p>
                <Placeholder
                  label={
                    isDe
                      ? "TODO: Name und Anschrift werden aus lib/site-config.ts gezogen"
                      : "TODO: name and address are pulled from lib/site-config.ts"
                  }
                />
              </p>
            )}
            <p>
              {isDe ? "E-Mail: " : "Email: "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="font-bold text-trust-500 underline-offset-2 hover:underline"
              >
                {siteConfig.contactEmail}
              </a>
            </p>
          </Section>

          <Section
            title={
              isDe
                ? "2. Welche Daten wir verarbeiten"
                : "2. What data we process"
            }
          >
            <p>
              <strong>
                {isDe
                  ? "Bei Nutzung ohne Konto:"
                  : "When using without an account:"}
              </strong>
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>
                {isDe
                  ? "Hochgeladene Dokumente (Foto oder PDF deines Briefes)"
                  : "Uploaded documents (photo or PDF of your letter)"}
              </li>
              <li>
                {isDe
                  ? "Aus dem Brief erkannter Text und automatisierte Analyse"
                  : "Text recognised from the letter and automated analysis"}
              </li>
              <li>
                {isDe
                  ? "Technische Daten: IP-Adresse, Browsertyp, Zeitstempel (vom Hosting-Anbieter zur Sicherheit)"
                  : "Technical data: IP address, browser type, timestamps (kept by the hosting provider for security)"}
              </li>
            </ul>
            <p>
              <strong>
                {isDe ? "Mit Konto/Mitgliedschaft:" : "With account/membership:"}
              </strong>
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>{isDe ? "E-Mail-Adresse" : "Email address"}</li>
              <li>
                {isDe
                  ? "Zahlungsstatus und Abo-Informationen (aber keine Zahlungsdaten — die liegen ausschließlich bei Stripe)"
                  : "Payment status and subscription info (but no payment details — those stay only with Stripe)"}
              </li>
              <li>
                {isDe
                  ? "Verlauf deiner hochgeladenen Briefe, damit du sie wiederfindest"
                  : "History of your uploaded letters so you can find them again"}
              </li>
            </ul>
          </Section>

          <Section
            title={isDe ? "3. Rechtsgrundlagen" : "3. Legal basis"}
          >
            <p>
              {isDe
                ? "Wir verarbeiten deine Daten auf folgenden Grundlagen:"
                : "We process your data on the following bases:"}
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>
                {isDe
                  ? "Art. 6 Abs. 1 lit. b DSGVO — Vertragserfüllung (Brief-Analyse, Mitgliedschaft)"
                  : "Art. 6 (1) (b) GDPR — performance of contract (letter analysis, membership)"}
              </li>
              <li>
                {isDe
                  ? "Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse (Sicherheit, Missbrauchsverhinderung)"
                  : "Art. 6 (1) (f) GDPR — legitimate interest (security, abuse prevention)"}
              </li>
              <li>
                {isDe
                  ? "Art. 6 Abs. 1 lit. c DSGVO — rechtliche Verpflichtung (z.B. steuerliche Aufbewahrung)"
                  : "Art. 6 (1) (c) GDPR — legal obligation (e.g. tax retention)"}
              </li>
            </ul>
            <p>
              {isDe
                ? "Da Behördenbriefe besondere Kategorien personenbezogener Daten enthalten können, verarbeiten wir diese auf Grundlage deiner ausdrücklichen Einwilligung gemäß Art. 9 Abs. 2 lit. a DSGVO, die du durch den Upload erteilst."
                : "Because official letters may contain special categories of personal data, we process them based on your explicit consent under Art. 9 (2) (a) GDPR, which you give by uploading."}
            </p>
          </Section>

          <Section
            title={
              isDe
                ? "4. Dienstleister (Auftragsverarbeiter)"
                : "4. Service providers (processors)"
            }
          >
            <p>
              {isDe
                ? "Wir setzen sorgfältig ausgewählte Dienstleister ein, die uns vertraglich (Auftragsverarbeitung nach Art. 28 DSGVO) zu Datenschutz verpflichten:"
                : "We use carefully selected service providers who are contractually committed to data protection (data processing agreement under Art. 28 GDPR):"}
            </p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>Supabase</strong> (Supabase Inc., USA):{" "}
                {isDe
                  ? "Hosting der Datenbank und Speicher für hochgeladene Briefe. Region: EU (Frankfurt). Drittland-Übermittlung über EU-Standardvertragsklauseln abgesichert."
                  : "Database and storage hosting for uploaded letters. Region: EU (Frankfurt). Third-country transfer secured via EU Standard Contractual Clauses."}
              </li>
              <li>
                <strong>Google Document AI</strong> (Google Ireland Ltd., Irland):{" "}
                {isDe
                  ? "Texterkennung (OCR) aus den hochgeladenen Briefen. Region: EU. Dokumente werden nur kurzzeitig zur Verarbeitung an Google übermittelt und nicht zu Trainingszwecken genutzt."
                  : "Optical character recognition (OCR) from uploaded letters. Region: EU. Documents are transmitted to Google only for short-term processing and not used for training."}
              </li>
              <li>
                <strong>Stripe</strong> (Stripe Payments Europe Ltd., Irland):{" "}
                {isDe
                  ? "Zahlungsabwicklung für die Mitgliedschaft. Wir erhalten von Stripe nur den Zahlungsstatus — keine Karten- oder Kontodaten."
                  : "Payment processing for the membership. We receive only the payment status from Stripe — no card or account data."}
              </li>
              <li>
                <strong>Vercel</strong> (Vercel Inc., USA):{" "}
                {isDe
                  ? "Hosting der Webanwendung. Drittland-Übermittlung über EU-Standardvertragsklauseln abgesichert."
                  : "Web application hosting. Third-country transfer secured via EU Standard Contractual Clauses."}
              </li>
            </ul>
          </Section>

          <Section
            title={isDe ? "5. Speicherdauer" : "5. Retention period"}
          >
            <ul className="ml-5 list-disc space-y-1">
              <li>
                {isDe
                  ? "Hochgeladene Briefe und Analysen: solange dein Konto besteht oder bis du sie selbst löschst"
                  : "Uploaded letters and analyses: as long as your account exists or until you delete them"}
              </li>
              <li>
                {isDe
                  ? "Konto-Daten: für die Dauer der Mitgliedschaft, danach Löschung innerhalb von 30 Tagen"
                  : "Account data: for the duration of the membership, then deleted within 30 days"}
              </li>
              <li>
                {isDe
                  ? "Abrechnungsbelege: 10 Jahre (gesetzliche Aufbewahrungsfrist, § 147 AO)"
                  : "Billing records: 10 years (statutory retention period under § 147 AO)"}
              </li>
              <li>
                {isDe
                  ? "Server-Logs: max. 30 Tage zur Sicherheit"
                  : "Server logs: max. 30 days for security"}
              </li>
            </ul>
          </Section>

          <Section
            title={isDe ? "6. Deine Rechte" : "6. Your rights"}
          >
            <p>
              {isDe
                ? "Nach DSGVO hast du folgende Rechte uns gegenüber:"
                : "Under the GDPR you have the following rights toward us:"}
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>
                {isDe
                  ? "Auskunft über deine Daten (Art. 15)"
                  : "Right of access (Art. 15)"}
              </li>
              <li>
                {isDe
                  ? "Berichtigung unrichtiger Daten (Art. 16)"
                  : "Rectification of inaccurate data (Art. 16)"}
              </li>
              <li>
                {isDe
                  ? "Löschung deiner Daten (Art. 17)"
                  : "Erasure of your data (Art. 17)"}
              </li>
              <li>
                {isDe
                  ? "Einschränkung der Verarbeitung (Art. 18)"
                  : "Restriction of processing (Art. 18)"}
              </li>
              <li>
                {isDe
                  ? "Datenübertragbarkeit (Art. 20)"
                  : "Data portability (Art. 20)"}
              </li>
              <li>
                {isDe
                  ? "Widerruf erteilter Einwilligungen (Art. 7 Abs. 3)"
                  : "Withdrawal of consent given (Art. 7 (3))"}
              </li>
              <li>
                {isDe
                  ? "Widerspruch gegen Verarbeitung auf Grundlage berechtigter Interessen (Art. 21)"
                  : "Object to processing based on legitimate interests (Art. 21)"}
              </li>
            </ul>
            <p>
              {isDe
                ? "Eine einfache E-Mail an "
                : "A simple email to "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="font-bold text-trust-500 underline-offset-2 hover:underline"
              >
                {siteConfig.contactEmail}
              </a>
              {isDe ? " reicht aus." : " is sufficient."}
            </p>
          </Section>

          <Section
            title={
              isDe
                ? "7. Beschwerderecht bei der Aufsichtsbehörde"
                : "7. Right to lodge a complaint"
            }
          >
            <p>
              {isDe
                ? "Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. In Deutschland ist das die Aufsichtsbehörde des Bundeslandes deines Wohnsitzes."
                : "You have the right to lodge a complaint with a data protection supervisory authority. In Germany, this is the authority of the federal state where you reside."}
            </p>
          </Section>

          <Section
            title={
              isDe ? "8. Cookies und Tracking" : "8. Cookies and tracking"
            }
          >
            <p>
              {isDe
                ? "Wir nutzen ausschließlich technisch notwendige Cookies (z.B. für deinen Login und die Spracheinstellung). Kein Werbe-Tracking, keine Drittanbieter-Analytik, kein Profiling. Daher gibt es auch keinen Cookie-Banner."
                : "We use only technically necessary cookies (e.g. for your login and language preference). No advertising tracking, no third-party analytics, no profiling. That's why we don't show a cookie banner."}
            </p>
          </Section>

          <Section
            title={
              isDe
                ? "9. Hinweis zu künstlicher Intelligenz"
                : "9. Notice on artificial intelligence"
            }
          >
            <p>
              {isDe
                ? "Sollten wir künftig zusätzliche KI-Dienste (z.B. Anthropic Claude) für die Analyse einsetzen, werden wir diese Datenschutzerklärung entsprechend anpassen und dich vorab informieren."
                : "Should we use additional AI services (e.g. Anthropic Claude) for analysis in the future, we will update this privacy policy accordingly and inform you in advance."}
            </p>
          </Section>
        </div>
      </section>
      <FooterDisclaimer language={language} />
    </main>
  );
}
