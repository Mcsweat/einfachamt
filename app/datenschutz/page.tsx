import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";

// Datenschutzerklärung is a German legal requirement and is always in German.

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-base leading-7 text-slate-700">
        {children}
      </div>
    </section>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <span className="rounded bg-amber-100 px-1 text-sm font-bold text-amber-900">
      {label}
    </span>
  );
}

export async function generateMetadata() {
  const title = "Datenschutz | EinfachAmt";
  const description =
    "Datenschutzerklärung von EinfachAmt. Alle Daten auf EU-Servern, DSGVO-konform, kein Werbe-Tracking.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://einfachamt.com/datenschutz",
      siteName: "EinfachAmt",
      locale: "de_DE",
    },
  };
}

export default async function DatenschutzPage() {
  const language = await getLanguage();
  const t = copy[language];

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title="Datenschutz"
        backHref="/account"
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-10 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          Datenschutzerklärung
        </h1>

        <div className="mt-7 space-y-4">
          {/* Section 1 — Verantwortlicher */}
          <Section title="1. Verantwortlicher">
            <p>
              <Placeholder label="[Name des Betreibers]" />
              {", "}
              <Placeholder label="[Adresse]" />
            </p>
            <p>
              E-Mail:{" "}
              <a
                href="mailto:Einfachamt@gmail.com"
                className="font-bold text-trust-500 underline-offset-2 hover:underline"
              >
                Einfachamt@gmail.com
              </a>
            </p>
          </Section>

          {/* Section 2 — Welche Daten wir verarbeiten */}
          <Section title="2. Welche Daten wir verarbeiten">
            <ul className="ml-5 list-disc space-y-1">
              <li>E-Mail-Adresse (bei Kontoerstellung)</li>
              <li>Hochgeladene Dokumente (Fotos/PDFs deiner Briefe)</li>
              <li>Zahlungsdaten (über Stripe, nicht direkt gespeichert)</li>
              <li>Technische Logs (Vercel)</li>
            </ul>
          </Section>

          {/* Section 3 — Dienstleister */}
          <Section title="3. Dienstleister">
            <ul className="ml-5 list-disc space-y-3">
              <li>
                <strong>Supabase</strong> (Irland/USA) —
                Authentifizierung &amp; Dokumentenspeicher —{" "}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-trust-500 underline-offset-2 hover:underline"
                >
                  supabase.com/privacy
                </a>
              </li>
              <li>
                <strong>Google Cloud Document AI</strong> (EU-Region Frankfurt)
                — Texterkennung (OCR) —{" "}
                <a
                  href="https://cloud.google.com/terms/cloud-privacy-notice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-trust-500 underline-offset-2 hover:underline"
                >
                  cloud.google.com/terms/cloud-privacy-notice
                </a>
              </li>
              <li>
                <strong>Stripe Inc.</strong> (USA) — Zahlungsabwicklung —{" "}
                <a
                  href="https://stripe.com/de/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-trust-500 underline-offset-2 hover:underline"
                >
                  stripe.com/de/privacy
                </a>
              </li>
              <li>
                <strong>Vercel Inc.</strong> (USA) — Hosting &amp; CDN —{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-trust-500 underline-offset-2 hover:underline"
                >
                  vercel.com/legal/privacy-policy
                </a>
              </li>
              <li>
                <strong>Resend</strong> (USA) — E-Mail-Versand —{" "}
                <a
                  href="https://resend.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-trust-500 underline-offset-2 hover:underline"
                >
                  resend.com/legal/privacy-policy
                </a>
              </li>
            </ul>
          </Section>

          {/* Section 4 — Deine Rechte */}
          <Section title="4. Deine Rechte (DSGVO Art. 15–21)">
            <p>Du hast das Recht auf:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Auskunft (Art. 15)</li>
              <li>Berichtigung (Art. 16)</li>
              <li>Löschung (Art. 17)</li>
              <li>Einschränkung der Verarbeitung (Art. 18)</li>
              <li>Datenübertragbarkeit (Art. 20)</li>
              <li>Widerspruch (Art. 21)</li>
            </ul>
            <p>
              Anfragen an:{" "}
              <a
                href="mailto:Einfachamt@gmail.com"
                className="font-bold text-trust-500 underline-offset-2 hover:underline"
              >
                Einfachamt@gmail.com
              </a>
            </p>
          </Section>

          {/* Section 5 — Speicherdauer */}
          <Section title="5. Speicherdauer">
            <ul className="ml-5 list-disc space-y-1">
              <li>
                Dokumente: bis zur manuellen Löschung durch den Nutzer
              </li>
              <li>
                Abodaten: gesetzliche Aufbewahrungsfrist (10 Jahre)
              </li>
            </ul>
          </Section>

          {/* Section 6 — Cookies */}
          <Section title="6. Cookies">
            <p>
              Nur technisch notwendige Cookies (Spracheinstellung,
              Authentifizierung). Kein Tracking, keine Werbecookies.
            </p>
          </Section>
        </div>
      </section>
      <FooterDisclaimer language={language} />
    </main>
  );
}
