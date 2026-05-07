import Link from "next/link";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="min-h-svh bg-trust-50">
      <section className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col px-4 pb-8 pt-8">
        <Logo />
        <div className="flex flex-1 flex-col justify-center">
          <div className="rounded-[2rem] bg-white/95 p-6 shadow-soft">
            <p className="text-base font-bold text-trust-700">404</p>
            <h1 className="mt-2 text-4xl font-bold leading-tight text-ink">
              Diese Seite gibt es nicht.
            </h1>
            <p className="mt-4 text-xl leading-8 text-slate-700">
              Du bist wahrscheinlich auf einer technischen Platzhalter-Adresse
              gelandet.
            </p>
            <div className="mt-6 grid gap-3">
              <Link
                href="/upload"
                className="flex min-h-14 items-center justify-center rounded-full bg-trust-500 px-5 py-4 text-center text-lg font-bold text-white shadow-soft"
              >
                Brief hochladen
              </Link>
              <Link
                href="/"
                className="flex min-h-12 items-center justify-center rounded-full bg-trust-100 px-5 py-3 text-center font-bold text-trust-700"
              >
                Zur Startseite
              </Link>
            </div>
          </div>
        </div>
      </section>
      <FooterDisclaimer />
    </main>
  );
}
