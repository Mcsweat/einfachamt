import Link from "next/link";
import { BottomActionBar } from "@/components/BottomActionBar";
import { DeleteDocumentButton } from "@/components/DeleteDocumentButton";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { getSavedDocuments } from "@/lib/saved-documents";

function StatusBadge({ status, t }: { status: string; t: { statusAnalyzed: string; statusReading: string; statusUploaded: string } }) {
  if (status === "analyzed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        {t.statusAnalyzed}
      </span>
    );
  }
  if (status === "reading") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
        {t.statusReading}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      {t.statusUploaded}
    </span>
  );
}

export default async function DashboardPage() {
  const language = await getLanguage();
  const t = copy[language];
  const locale = language === "de" ? "de-DE" : language === "tr" ? "tr-TR" : language === "ar" ? "ar-EG" : language === "ru" ? "ru-RU" : language === "uk" ? "uk-UA" : "en-US";
  const { user, documents } = await getSavedDocuments(locale);
  const isEmailUser = Boolean(user && !user.is_anonymous);

  const analyzedCount = documents.filter((d) => d.status === "analyzed").length;
  const withDeadline = documents.filter((d) => d.deadline).length;

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

        {!isEmailUser ? (
          <section className="mt-6 rounded-[2rem] bg-white/95 p-5 shadow-sm">
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

        {/* Stats bar */}
        {documents.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-[1.25rem] bg-white/95 p-3 text-center shadow-sm">
              <p className="text-2xl font-black text-ink">{documents.length}</p>
              <p className="mt-0.5 text-xs font-bold text-slate-500">
                {language === "de" ? "Briefe" : language === "tr" ? "Mektup" : language === "ar" ? "رسائل" : language === "ru" ? "Писем" : language === "uk" ? "Листів" : "Letters"}
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-white/95 p-3 text-center shadow-sm">
              <p className="text-2xl font-black text-emerald-600">{analyzedCount}</p>
              <p className="mt-0.5 text-xs font-bold text-slate-500">
                {language === "de" ? "Analysiert" : language === "tr" ? "Analiz" : language === "ar" ? "محلل" : language === "ru" ? "Анализов" : language === "uk" ? "Аналізів" : "Analyzed"}
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-white/95 p-3 text-center shadow-sm">
              <p className="text-2xl font-black text-amber-600">{withDeadline}</p>
              <p className="mt-0.5 text-xs font-bold text-slate-500">
                {language === "de" ? "Mit Frist" : language === "tr" ? "Süre" : language === "ar" ? "مع مهلة" : language === "ru" ? "Со сроком" : language === "uk" ? "Зі строком" : "Deadlines"}
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 space-y-3">
          {documents.length > 0 ? (
            documents.map((document) => (
              <article
                key={document.id}
                className="overflow-hidden rounded-[1.55rem] bg-white/95 shadow-sm"
              >
                <Link href={`/analysis/${document.id}`} className="block p-5">
                  {/* Top row: status + date */}
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge status={document.status} t={t} />
                    <p className="shrink-0 text-xs font-bold text-slate-400">
                      {document.createdAt}
                    </p>
                  </div>

                  {/* Summary or filename */}
                  <p className="mt-3 text-base font-bold leading-6 text-ink line-clamp-2">
                    {document.summary ?? document.fileName}
                  </p>

                  {/* Filename (if summary shown) */}
                  {document.summary && (
                    <p className="mt-1 text-xs text-slate-400 truncate">
                      📎 {document.fileName}
                    </p>
                  )}

                  {/* Deadline pill */}
                  {document.deadline && (
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">
                      ⏰ {document.deadline}
                    </div>
                  )}

                  {/* Open link */}
                  <div className="mt-4 flex items-center gap-1 text-sm font-bold text-trust-500">
                    {t.openAnalysis} →
                  </div>
                </Link>

                <div className="border-t border-slate-100 px-5 pb-4 pt-3">
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
                </div>
              </article>
            ))
          ) : (
            <section className="rounded-[2rem] bg-white/95 p-6 text-center shadow-sm">
              <p className="text-5xl">📭</p>
              <h2 className="mt-4 text-2xl font-bold text-ink">
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

        {/* Quick tool shortcuts */}
        {isEmailUser && documents.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link
              href="/widerspruch"
              className="flex items-center gap-3 rounded-[1.25rem] bg-white/95 px-4 py-3 shadow-sm transition active:scale-[0.97]"
            >
              <span className="text-xl">✊</span>
              <span className="text-sm font-bold text-slate-700">
                {language === "de" ? "Widerspruch" : "Appeal"}
              </span>
            </Link>
            <Link
              href="/antrag"
              className="flex items-center gap-3 rounded-[1.25rem] bg-white/95 px-4 py-3 shadow-sm transition active:scale-[0.97]"
            >
              <span className="text-xl">📄</span>
              <span className="text-sm font-bold text-slate-700">
                {language === "de" ? "Antrag" : "Application"}
              </span>
            </Link>
          </div>
        )}
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
