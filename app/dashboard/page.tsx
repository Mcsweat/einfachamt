import Link from "next/link";
import { BottomActionBar } from "@/components/BottomActionBar";
import { DeleteDocumentButton } from "@/components/DeleteDocumentButton";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { getSavedDocuments } from "@/lib/saved-documents";

type StatusCopy = {
  statusAnalyzed: string;
  statusReading: string;
  statusUploaded: string;
};

function statusLabel(status: string, t: StatusCopy) {
  if (status === "analyzed") {
    return t.statusAnalyzed;
  }

  if (status === "reading") {
    return t.statusReading;
  }

  return t.statusUploaded;
}

export default async function DashboardPage() {
  const language = await getLanguage();
  const t = copy[language];
  const { user, documents } = await getSavedDocuments(
    language === "de" ? "de-DE" : "en-US",
  );
  const isEmailUser = Boolean(user && !user.is_anonymous);

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={t.dashboardCta}
        backHref="/"
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          {t.dashboardTitle}
        </h1>
        <p className="mt-4 text-xl leading-8 text-slate-700">
          {t.dashboardIntro}
        </p>

        {!isEmailUser ? (
          <section className="mt-7 rounded-[2rem] bg-white/95 p-5 shadow-sm">
            <h2 className="text-2xl font-bold text-ink">
              {t.dashboardSavePrompt}
            </h2>
            <p className="mt-3 text-lg leading-8 text-slate-700">
              {t.dashboardSaveText}
            </p>
            <Link
              href="/login?next=/dashboard"
              className="mt-5 flex min-h-14 items-center justify-center rounded-full bg-trust-500 px-5 py-4 text-lg font-bold text-white shadow-soft"
            >
              {t.emailLogin}
            </Link>
          </section>
        ) : null}

        <div className="mt-7 space-y-3">
          {documents.length > 0 ? (
            documents.map((document) => (
              <article
                key={document.id}
                className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm"
              >
                <Link href={`/analysis/${document.id}`} className="block">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-base font-bold text-trust-700">
                      {statusLabel(document.status, t)}
                    </p>
                    <p className="shrink-0 text-sm font-bold text-slate-500">
                      {document.createdAt}
                    </p>
                  </div>
                  <h2 className="mt-2 break-words text-xl font-bold leading-7 text-ink">
                    {document.fileName}
                  </h2>
                  <span className="mt-4 inline-flex min-h-11 items-center rounded-full bg-trust-100 px-4 py-2 text-base font-bold text-trust-700">
                    {t.openAnalysis}
                  </span>
                </Link>
                <DeleteDocumentButton
                  documentId={document.id}
                  fileUrl={document.fileUrl}
                  labels={{
                    idle: t.deleteLetter,
                    loading: t.deletingLetter,
                    confirm: t.deleteLetterConfirm,
                    error: t.deleteLetterError,
                  }}
                />
              </article>
            ))
          ) : (
            <section className="rounded-[2rem] bg-white/95 p-5 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-ink">
                {t.noLettersTitle}
              </h2>
              <p className="mt-3 text-lg leading-8 text-slate-700">
                {t.noLettersText}
              </p>
              <Link
                href="/upload"
                className="mt-5 flex min-h-14 items-center justify-center rounded-full bg-trust-500 px-5 py-4 text-lg font-bold text-white shadow-soft"
              >
                {t.firstUpload}
              </Link>
            </section>
          )}
        </div>
      </section>
      <FooterDisclaimer language={language} />

      <BottomActionBar>
        <Link
          href="/upload"
          className="flex min-h-14 items-center justify-center rounded-full bg-trust-500 px-5 py-4 text-center text-[17px] font-bold text-white shadow-soft transition active:scale-[0.98]"
        >
          {t.newUpload}
        </Link>
      </BottomActionBar>
    </main>
  );
}
