import Link from "next/link";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { siteConfig } from "@/lib/site-config";

function SecurityCard({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-trust-100 text-xl">
          {icon}
        </span>
        <div>
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <div className="mt-2 text-base leading-7 text-slate-700">{children}</div>
        </div>
      </div>
    </section>
  );
}

export default async function SecurityPage() {
  const language = await getLanguage();
  const t = copy[language];
  const isDe = language === "de";

  const badges = isDe
    ? [
        { icon: "🇪🇺", label: "EU Frankfurt" },
        { icon: "🔒", label: "Verschlüsselt" },
        { icon: "🚫", label: "Kein Tracking" },
        { icon: "📋", label: "DSGVO" },
        { icon: "🗑", label: "Löschbar" },
      ]
    : [
        { icon: "🇪🇺", label: "EU Frankfurt" },
        { icon: "🔒", label: "Encrypted" },
        { icon: "🚫", label: "No tracking" },
        { icon: "📋", label: "GDPR" },
        { icon: "🗑", label: "Deletable" },
      ];

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={t.security}
        backHref="/"
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-10 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          {isDe ? "Sicherheit" : "Security"}
        </h1>
        <p className="mt-4 text-lg leading-7 text-slate-700">
          {isDe
            ? "Klar und konkret: Hier erfährst du, wie deine Daten geschützt werden."
            : "Clear and specific: here you can find out how your data is protected."}
        </p>

        {/* Trust badges */}
        <div className="mt-5 flex flex-wrap gap-2">
          {badges.map((b) => (
            <span
              key={b.label}
              className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-sm font-bold text-slate-700 shadow-sm"
            >
              <span>{b.icon}</span>
              {b.label}
            </span>
          ))}
        </div>

        <div className="mt-7 space-y-4">
          <SecurityCard icon="🇪🇺" title={isDe ? "EU-Server in Frankfurt" : "EU servers in Frankfurt"}>
            {isDe
              ? "Deine hochgeladenen Briefe werden in Supabase auf einem Server in Frankfurt gespeichert — innerhalb der EU. Kein unkontrollierter Datentransfer in die USA. Für alle Drittländer-Übermittlungen gelten EU-Standardvertragsklauseln."
              : "Your uploaded letters are stored in Supabase on a server in Frankfurt — within the EU. No uncontrolled data transfer to the US. EU Standard Contractual Clauses apply for all third-country transfers."}
          </SecurityCard>

          <SecurityCard icon="🔒" title={isDe ? "Nur du siehst deine Briefe" : "Only you can see your letters"}>
            {isDe
              ? "Jeder Brief ist ausschließlich deinem Konto zugeordnet. Row Level Security in der Datenbank stellt sicher, dass kein anderer Nutzer deine Daten lesen, ändern oder löschen kann — auch nicht versehentlich."
              : "Every letter is linked exclusively to your account. Row Level Security in the database ensures that no other user can read, change, or delete your data — not even accidentally."}
          </SecurityCard>

          <SecurityCard icon="🚫" title={isDe ? "Kein Werbe-Tracking" : "No ad tracking"}>
            {isDe
              ? "Wir verwenden keine Werbe-Cookies, kein Facebook Pixel und keine Google Analytics. Deshalb brauchst du auch keinen Cookie-Banner wegzuklicken. Wir sammeln nur technisch notwendige Daten (z. B. Login-Session)."
              : "We do not use advertising cookies, Facebook Pixel, or Google Analytics. That's why you don't need to dismiss a cookie banner. We only collect technically necessary data (e.g. login session)."}
          </SecurityCard>

          <SecurityCard icon="🔐" title={isDe ? "Verschlüsselte Übertragung" : "Encrypted connection"}>
            {isDe
              ? "Alle Verbindungen zwischen deinem Gerät und unseren Servern sind mit TLS (HTTPS) verschlüsselt. Deine Briefe und persönlichen Daten werden niemals unverschlüsselt übertragen."
              : "All connections between your device and our servers are encrypted with TLS (HTTPS). Your letters and personal data are never transmitted unencrypted."}
          </SecurityCard>

          <SecurityCard icon="🗑" title={isDe ? "Daten jederzeit löschen" : "Delete your data anytime"}>
            {isDe ? (
              <>
                Du kannst jeden hochgeladenen Brief in deinem Konto unter{" "}
                <strong>Meine Briefe</strong> löschen. Für die vollständige
                Kontolöschung schreib uns kurz an{" "}
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="font-bold text-trust-500 underline-offset-2 hover:underline"
                >
                  {siteConfig.contactEmail}
                </a>{" "}
                — wir löschen alles innerhalb von 30 Tagen.
              </>
            ) : (
              <>
                You can delete every uploaded letter in your account under{" "}
                <strong>My letters</strong>. For full account deletion, write to{" "}
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="font-bold text-trust-500 underline-offset-2 hover:underline"
                >
                  {siteConfig.contactEmail}
                </a>{" "}
                — we delete everything within 30 days.
              </>
            )}
          </SecurityCard>

          <SecurityCard icon="📋" title={isDe ? "DSGVO-konform" : "GDPR compliant"}>
            {isDe
              ? "Mit allen eingesetzten Dienstleistern bestehen Auftragsverarbeitungsverträge nach Art. 28 DSGVO. Deine Rechte — Auskunft, Berichtigung, Löschung und Datenübertragbarkeit — gelten vollständig. Eine einfache E-Mail reicht aus."
              : "We have data processing agreements under Art. 28 GDPR with all service providers we use. Your rights — access, rectification, erasure, and portability — apply in full. A simple email is sufficient."}
          </SecurityCard>

          {/* Providers */}
          <section className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-ink">
              {isDe ? "Eingesetzte Dienstleister" : "Service providers we use"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {isDe
                ? "Alle mit Auftragsverarbeitungsvertrag nach Art. 28 DSGVO."
                : "All with data processing agreement under Art. 28 GDPR."}
            </p>
            <div className="mt-4 space-y-3">
              {[
                {
                  name: "Supabase",
                  detail: isDe
                    ? "Datenbank & Speicher — EU Frankfurt"
                    : "Database & storage — EU Frankfurt",
                },
                {
                  name: "Google Document AI",
                  detail: isDe
                    ? "Texterkennung (OCR) — EU-Region, kein Training"
                    : "Text recognition (OCR) — EU region, no training",
                },
                {
                  name: "Stripe",
                  detail: isDe
                    ? "Zahlungen — Stripe Payments Europe Ltd., Irland"
                    : "Payments — Stripe Payments Europe Ltd., Ireland",
                },
                {
                  name: "Vercel",
                  detail: isDe
                    ? "App-Hosting — mit EU-Standardvertragsklauseln"
                    : "App hosting — with EU Standard Contractual Clauses",
                },
              ].map((p) => (
                <div key={p.name} className="flex items-start gap-3">
                  <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-trust-400" />
                  <div>
                    <p className="text-base font-bold text-ink">{p.name}</p>
                    <p className="text-sm text-slate-500">{p.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-[1.55rem] bg-trust-500 p-5 shadow-sm">
            <p className="text-base font-bold text-white">
              {isDe ? "Noch Fragen zur Sicherheit?" : "Still have questions about security?"}
            </p>
            <p className="mt-1 text-sm leading-6 text-trust-100">
              {isDe
                ? "Schreib uns — wir antworten persönlich."
                : "Write to us — we reply personally."}
            </p>
            <Link
              href="/kontakt"
              className="mt-4 inline-flex min-h-10 items-center rounded-full bg-white px-5 py-2 text-sm font-bold text-trust-700"
            >
              {isDe ? "Kontakt aufnehmen" : "Get in touch"}
            </Link>
          </section>
        </div>
      </section>
      <FooterDisclaimer language={language} />
    </main>
  );
}
