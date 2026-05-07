import Link from "next/link";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { PricingCard } from "@/components/PricingCard";

export default function PricingPage() {
  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader title="Preise" backHref="/" />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          Einfach starten
        </h1>
        <p className="mt-4 text-xl leading-8 text-slate-700">
          Die erste Version nutzt Platzhalter. Zahlungen kommen später über
          Stripe Checkout.
        </p>

        <div className="mt-7 space-y-4">
          <PricingCard
            name="Free"
            price="0 €"
            description="Zum Ausprobieren."
            features={[
              "3 Briefanalysen",
              "einfache Erklärung",
              "Antwortentwurf",
            ]}
          />
          <PricingCard
            name="Plus"
            price="9 €/Monat"
            description="Platzhalter für den Monatsplan."
            highlighted
            features={[
              "unbegrenzte Analysen",
              "gespeicherte Briefe",
              "Erinnerungen",
              "Antwortentwürfe",
            ]}
          />
          <PricingCard
            name="Premium später"
            price="39–99 €"
            description="Platzhalter für geführte Formularhilfe."
            features={[
              "geführte Formularhilfe",
              "mehr Unterstützung",
              "später verfügbar",
            ]}
          />
        </div>

        <Link
          href="/upload"
          className="mt-6 flex min-h-14 items-center justify-center rounded-full bg-trust-100 px-5 py-4 text-center text-lg font-bold text-trust-700"
        >
          Kostenlos starten
        </Link>
      </section>
      <FooterDisclaimer />
    </main>
  );
}
