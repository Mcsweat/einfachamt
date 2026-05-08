import Link from "next/link";
import { BottomActionBar } from "@/components/BottomActionBar";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { getSavedDocuments } from "@/lib/saved-documents";

function statusLabel(status: string) {
  if (status === "analyzed") {
    return "Analysiert";
  }

  if (status === "reading") {
    return "Wird gelesen";
  }

  return "Hochgeladen";
}

export default async function DashboardPage() {
  const { user, documents } = await getSavedDocuments();
  const isEmailUser = Boolean(user && !user.is_anonymous);

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader title="Meine Briefe" backHref="/" />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          Deine Briefe
        </h1>
        <p className="mt-4 text-xl leading-8 text-slate-700">
          Hier findest du deine hochgeladenen Briefe wieder.
        </p>

        {!isEmailUser ? (
          <section className="mt-7 rounded-[2rem] bg-white/95 p-5 shadow-sm">
            <h2 className="text-2xl font-bold text-ink">
              Auf allen Geraeten nutzen
            </h2>
            <p className="mt-3 text-lg leading-8 text-slate-700">
              Logge dich mit E-Mail ein, damit deine Briefe und dein Plus-Zugang
              auch auf einem anderen Handy oder Browser verfuegbar sind.
            </p>
            <Link
              href="/login?next=/dashboard"
              className="mt-5 flex min-h-14 items-center justify-center rounded-full bg-trust-500 px-5 py-4 text-lg font-bold text-white shadow-soft"
            >
              Mit E-Mail einloggen
            </Link>
          </section>
        ) : null}

        <div className="mt-7 space-y-3">
          {documents.length > 0 ? (
            documents.map((document) => (
              <Link
                key={document.id}
                href={`/analysis/${document.id}`}
                className="block rounded-[1.55rem] bg-white/95 p-5 shadow-sm transition active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-base font-bold text-trust-700">
                    {statusLabel(document.status)}
                  </p>
                  <p className="shrink-0 text-sm font-bold text-slate-500">
                    {document.createdAt}
                  </p>
                </div>
                <h2 className="mt-2 break-words text-xl font-bold leading-7 text-ink">
                  {document.fileName}
                </h2>
                <span className="mt-4 inline-flex min-h-11 items-center rounded-full bg-trust-100 px-4 py-2 text-base font-bold text-trust-700">
                  Analyse oeffnen
                </span>
              </Link>
            ))
          ) : (
            <section className="rounded-[2rem] bg-white/95 p-5 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-ink">
                Noch keine Briefe
              </h2>
              <p className="mt-3 text-lg leading-8 text-slate-700">
                Lade deinen ersten Brief hoch. Danach erscheint er hier.
              </p>
            </section>
          )}
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
