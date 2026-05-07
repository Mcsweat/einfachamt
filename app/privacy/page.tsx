import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";

export default function PrivacyPage() {
  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader title="Datenschutz" backHref="/" />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-10 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          Datenschutz
        </h1>
        <div className="mt-7 space-y-4">
          <section className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
            <h2 className="text-2xl font-bold text-ink">Kurz gesagt</h2>
            <p className="mt-3 text-lg leading-8 text-slate-700">
              Diese MVP-Version arbeitet mit Mock-Daten. Es findet noch keine
              echte KI-Analyse, kein OCR und kein echter Upload zu Supabase
              statt.
            </p>
          </section>
          <section className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
            <h2 className="text-2xl font-bold text-ink">Später geplant</h2>
            <p className="mt-3 text-lg leading-8 text-slate-700">
              Dokumente sollen geschützt gespeichert werden. Dafür sind
              Supabase Auth, Supabase Storage und klare Löschmöglichkeiten
              vorgesehen.
            </p>
          </section>
          <section className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
            <h2 className="text-2xl font-bold text-ink">Wichtig</h2>
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
