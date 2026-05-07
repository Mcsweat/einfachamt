import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";

export default function ImpressumPage() {
  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader title="Impressum" backHref="/" />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-10 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">Impressum</h1>
        <div className="mt-7 space-y-4">
          <section className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
            <h2 className="text-2xl font-bold text-ink">Angaben folgen</h2>
            <p className="mt-3 text-lg leading-8 text-slate-700">
              Platzhalter für Betreiberangaben, Adresse, Kontakt und
              Verantwortliche Person.
            </p>
          </section>
          <section className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
            <h2 className="text-2xl font-bold text-ink">Hinweis</h2>
            <p className="mt-3 text-lg leading-8 text-slate-700">
              EinfachAmt ist kein offizieller Behördendienst und bietet keine
              Rechtsberatung.
            </p>
          </section>
        </div>
      </section>
      <FooterDisclaimer />
    </main>
  );
}
