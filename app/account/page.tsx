import Link from "next/link";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { DeleteDocumentButton } from "@/components/DeleteDocumentButton";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { getSafeUser } from "@/lib/supabase/safe-auth";
import { getCurrentUserSubscription } from "@/lib/subscription";
import { getSavedDocuments } from "@/lib/saved-documents";
import { SignOutButton } from "./AccountActions";

export default async function AccountPage() {
  const language = await getLanguage();
  const t = copy[language];
  const user = await getSafeUser();
  const subscription = await getCurrentUserSubscription();
  const { documents } = await getSavedDocuments(
    language === "de" ? "de-DE" : "en-US",
  );
  const isEmailUser = Boolean(user && !user.is_anonymous);

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={t.account}
        backHref="/pricing"
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          {t.accountTitle}
        </h1>

        <div className="mt-7 rounded-[2rem] bg-white/95 p-5 shadow-sm">
          {isEmailUser ? (
            <>
              <p className="text-base font-bold text-slate-500">{t.email}</p>
              <p className="mt-1 break-words text-xl font-bold text-ink">
                {user!.email}
              </p>
              <p className="mt-5 text-base font-bold text-slate-500">
                {t.subscription}
              </p>
              <p className="mt-1 text-xl font-bold text-ink">
                {subscription.isPaid ? t.plusActive : "Free"}
              </p>
              <SignOutButton label={t.signOut} />
            </>
          ) : (
            <>
              <p className="text-xl font-bold leading-8 text-ink">
                {t.notLoggedIn}
              </p>
              <Link
                href="/login?next=/account"
                className="mt-5 flex min-h-14 items-center justify-center rounded-full bg-trust-500 px-5 py-4 text-lg font-bold text-white shadow-soft"
              >
                {t.signIn}
              </Link>
            </>
          )}
        </div>

        <h2 className="mt-8 text-2xl font-bold text-ink">
          {t.dashboardTitle}
        </h2>

        <div className="mt-4 space-y-3">
          {documents.length > 0 ? (
            documents.map((document) => (
              <article
                key={document.id}
                className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm"
              >
                <Link href={`/analysis/${document.id}`} className="block">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-bold text-trust-700">
                      {document.status === "analyzed"
                        ? t.statusAnalyzed
                        : document.status === "reading"
                          ? t.statusReading
                          : t.statusUploaded}
                    </p>
                    <p className="shrink-0 text-sm font-bold text-slate-500">
                      {document.createdAt}
                    </p>
                  </div>
                  <h3 className="mt-2 break-words text-lg font-bold leading-7 text-ink">
                    {document.fileName}
                  </h3>
                  <span className="mt-3 inline-flex min-h-10 items-center rounded-full bg-trust-100 px-4 py-2 text-sm font-bold text-trust-700">
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
            <div className="rounded-[1.55rem] bg-white/95 p-5 text-center shadow-sm">
              <p className="text-base leading-7 text-slate-700">
                {t.noLettersText}
              </p>
              <Link
                href="/upload"
                className="mt-4 flex min-h-12 items-center justify-center rounded-full bg-trust-500 px-5 py-3 text-base font-bold text-white shadow-soft"
              >
                {t.firstUpload}
              </Link>
            </div>
          )}
        </div>
      </section>
      <FooterDisclaimer language={language} />
    </main>
  );
}
