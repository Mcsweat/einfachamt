import Link from "next/link";
import { BottomActionBar } from "@/components/BottomActionBar";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { mockDocuments } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader title="Meine Briefe" backHref="/" />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          Deine Briefe
        </h1>
        <p className="mt-4 text-xl leading-8 text-slate-700">
          Wähle einen Brief aus oder lade einen neuen hoch.
        </p>

        <div className="mt-7 space-y-3">
          {mockDocuments.map((document) => (
            <Link
              key={document.id}
              href={`/analysis/${document.id}`}
              className="block rounded-[1.55rem] bg-white/95 p-5 shadow-sm transition active:scale-[0.99]"
            >
              <p className="text-base font-bold text-trust-700">
                {document.status}
              </p>
              <h2 className="mt-2 break-words text-xl font-bold leading-7 text-ink">
                {document.fileName}
              </h2>
              <p className="mt-3 text-lg leading-7 text-slate-700">
                Frist: {document.deadline}
              </p>
              <span className="mt-4 inline-flex min-h-11 items-center rounded-full bg-trust-100 px-4 py-2 text-base font-bold text-trust-700">
                Analyse öffnen
              </span>
            </Link>
          ))}
        </div>
      </section>
      <FooterDisclaimer />

      <BottomActionBar>
        <Link
          href="/upload"
          className="flex min-h-14 items-center justify-center rounded-full bg-trust-500 px-5 py-4 text-center text-[17px] font-bold text-white shadow-soft transition active:scale-[0.98]"
        >
          Neuen Brief hochladen
        </Link>
      </BottomActionBar>
    </main>
  );
}
