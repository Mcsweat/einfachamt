import Link from "next/link";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { PricingCard } from "@/components/PricingCard";
import { createClient } from "@/lib/supabase/server";
import { PricingCheckoutButton } from "./PricingCheckoutButton";

type PricingPageProps = {
  searchParams?: Promise<{
    checkout?: string;
  }>;
};

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const params = await searchParams;
  const checkout = params?.checkout;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(user && !user.is_anonymous);

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader title="Preise" backHref="/" />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          Einfach starten
        </h1>
        <p className="mt-4 text-xl leading-8 text-slate-700">
          Starte kostenlos. Mit Plus werden echte OCR-Lesung und mehr Briefe
          freigeschaltet.
        </p>

        {checkout === "success" ? (
          <p className="mt-5 rounded-[1.25rem] bg-emerald-50 p-4 text-base font-bold leading-6 text-emerald-800">
            Danke. Dein Plus-Zugang wird gerade aktiviert.
          </p>
        ) : null}

        {checkout === "cancelled" ? (
          <p className="mt-5 rounded-[1.25rem] bg-amber-50 p-4 text-base font-bold leading-6 text-amber-900">
            Checkout wurde abgebrochen. Du kannst jederzeit neu starten.
          </p>
        ) : null}

        <div className="mt-7 space-y-4">
          <PricingCard
            name="Free"
            price="0 EUR"
            description="Zum Ausprobieren."
            features={[
              "3 Briefanalysen",
              "einfache Erklaerung",
              "Antwortentwurf",
            ]}
          />
          <PricingCard
            name="Plus"
            price="9 EUR/Monat"
            description="Fuer echte OCR-Lesung und mehr Nutzung."
            highlighted
            features={[
              "Google Document AI OCR",
              "mehr Briefanalysen",
              "gespeicherte Briefe",
              "Antwortentwuerfe",
            ]}
          />
          <PricingCard
            name="Premium spaeter"
            price="39-99 EUR"
            description="Platzhalter fuer gefuehrte Formularhilfe."
            features={[
              "gefuehrte Formularhilfe",
              "mehr Unterstuetzung",
              "spaeter verfuegbar",
            ]}
          />
        </div>

        <PricingCheckoutButton isLoggedIn={isLoggedIn} />

        <Link
          href="/upload"
          className="mt-3 flex min-h-14 items-center justify-center rounded-full bg-trust-100 px-5 py-4 text-center text-lg font-bold text-trust-700"
        >
          Erst kostenlos testen
        </Link>
      </section>
      <FooterDisclaimer />
    </main>
  );
}
