import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-20">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-trust-100 px-4 py-2 text-sm font-semibold text-trust-700">
            Wir helfen dir, Briefe besser zu verstehen
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-normal text-ink md:text-6xl">
            Verstehe Jobcenter-Briefe in 30 Sekunden
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Lade deinen Brief hoch. Wir erklaeren ihn einfach, zeigen Fristen
            und helfen dir bei einer Antwort.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/upload"
              className="rounded-2xl bg-trust-700 px-6 py-4 text-center text-base font-bold text-white shadow-soft hover:bg-trust-500"
            >
              Brief hochladen
            </Link>
            <Link
              href="/analysis/demo-brief-1"
              className="rounded-2xl border border-trust-200 bg-white px-6 py-4 text-center text-base font-bold text-trust-700 hover:bg-trust-50"
            >
              Beispiel ansehen
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-trust-100 bg-trust-50 p-5 shadow-soft">
          <div className="rounded-3xl bg-white p-5">
            <p className="text-sm font-semibold text-slate-500">Beispiel</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-trust-100 p-4">
                <p className="text-sm font-bold text-ink">Kurz gesagt</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Das Jobcenter moechte Unterlagen von dir. Reagiere innerhalb
                  der Frist.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-trust-100 p-4">
                  <p className="text-xs font-semibold text-slate-500">Frist</p>
                  <p className="mt-1 text-sm font-bold text-ink">14 Tage</p>
                </div>
                <div className="rounded-2xl border border-trust-100 p-4">
                  <p className="text-xs font-semibold text-slate-500">Naechster Schritt</p>
                  <p className="mt-1 text-sm font-bold text-ink">Antwort senden</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
