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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 mt-6 px-1 text-xs font-bold uppercase tracking-widest text-slate-400">
      {children}
    </p>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  href,
  last = false,
}: {
  icon: string;
  label: string;
  value?: string;
  href?: string;
  last?: boolean;
}) {
  const inner = (
    <div
      className={`flex min-h-[54px] items-center gap-3 px-5 ${
        !last ? "border-b border-slate-100" : ""
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="flex-1 text-base font-semibold text-ink">{label}</span>
      {value ? (
        <span className="text-base text-slate-400">{value}</span>
      ) : null}
      {href ? (
        <span className="text-lg font-semibold text-slate-300">›</span>
      ) : null}
    </div>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }

  return inner;
}

export default async function AccountPage() {
  const language = await getLanguage();
  const t = copy[language];
  const user = await getSafeUser();
  const subscription = await getCurrentUserSubscription();
  const { documents } = await getSavedDocuments(
    language === "de" ? "de-DE" : "en-US",
  );
  const isEmailUser = Boolean(user && !user.is_anonymous);
  const initial = user?.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={t.accountTitle}
        backHref="/"
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">

        {isEmailUser ? (
          <>
            {/* Avatar + name */}
            <div className="flex flex-col items-center pb-2 pt-2">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-trust-500 text-4xl font-black text-white shadow-sm">
                {initial}
              </div>
              <p className="mt-3 break-all text-xl font-bold text-ink">
                {user!.email}
              </p>
              <span
                className={`mt-2 rounded-full px-3 py-1 text-sm font-bold ${
                  subscription.isPaid
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {subscription.isPaid ? t.plusActive : "Free"}
              </span>
            </div>

            {/* Konto section */}
            <SectionLabel>{t.accountSectionLabel}</SectionLabel>
            <div className="overflow-hidden rounded-[1.55rem] bg-white/95 shadow-sm">
              <SettingsRow
                icon="✉️"
                label={t.email}
                value={user!.email}
              />
              <SettingsRow
                icon="⭐"
                label={t.subscription}
                value={subscription.isPaid ? t.plusActive : "Free"}
                href="/pricing"
                last
              />
            </div>

            {/* Briefe section */}
            <SectionLabel>{t.dashboardTitle}</SectionLabel>
            <div className="overflow-hidden rounded-[1.55rem] bg-white/95 shadow-sm">
              {documents.length > 0 ? (
                documents.map((doc, index) => (
                  <div
                    key={doc.id}
                    className={index < documents.length - 1 ? "border-b border-slate-100" : ""}
                  >
                    <Link
                      href={`/analysis/${doc.id}`}
                      className="flex min-h-[64px] items-center gap-3 px-5 py-3"
                    >
                      <span className="text-xl">📄</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold text-ink">
                          {doc.fileName}
                        </p>
                        <p className="mt-0.5 text-sm text-slate-400">
                          {doc.status === "analyzed"
                            ? t.statusAnalyzed
                            : doc.status === "reading"
                              ? t.statusReading
                              : t.statusUploaded}{" "}
                          · {doc.createdAt}
                        </p>
                      </div>
                      <span className="text-lg font-semibold text-slate-300">›</span>
                    </Link>
                    <div className="px-5 pb-3">
                      <DeleteDocumentButton
                        documentId={doc.id}
                        fileUrl={doc.fileUrl}
                        labels={{
                          idle: t.deleteLetter,
                          loading: t.deletingLetter,
                          confirm: t.deleteLetterConfirm,
                          error: t.deleteLetterError,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center px-5 py-8 text-center">
                  <span className="text-4xl">📭</span>
                  <p className="mt-3 text-base text-slate-500">{t.noLettersText}</p>
                  <Link
                    href="/upload"
                    className="mt-4 inline-flex min-h-11 items-center rounded-full bg-trust-500 px-5 py-2 text-sm font-bold text-white shadow-soft"
                  >
                    {t.firstUpload}
                  </Link>
                </div>
              )}
            </div>

            {/* App section */}
            <SectionLabel>{t.accountAppSection}</SectionLabel>
            <div className="overflow-hidden rounded-[1.55rem] bg-white/95 shadow-sm">
              <SettingsRow icon="🔒" label={t.privacy} href="/privacy" />
              <SettingsRow icon="🛡️" label={t.security} href="/security" />
              <SettingsRow icon="📋" label={t.impressum} href="/impressum" last />
            </div>

            {/* Sign out */}
            <div className="mt-6 overflow-hidden rounded-[1.55rem] bg-white/95 shadow-sm">
              <SignOutButton label={t.signOut} />
            </div>
          </>
        ) : (
          <>
            {/* Not logged in */}
            <div className="flex flex-col items-center py-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 text-4xl">
                👤
              </div>
              <p className="mt-4 text-xl font-bold leading-8 text-ink">
                {t.notLoggedIn}
              </p>
              <Link
                href="/login?next=/account"
                className="mt-5 flex min-h-14 w-full items-center justify-center rounded-full bg-trust-500 px-5 py-4 text-lg font-bold text-white shadow-soft"
              >
                {t.signIn}
              </Link>
            </div>

            <SectionLabel>{t.accountAppSection}</SectionLabel>
            <div className="overflow-hidden rounded-[1.55rem] bg-white/95 shadow-sm">
              <SettingsRow icon="🔒" label={t.privacy} href="/privacy" />
              <SettingsRow icon="🛡️" label={t.security} href="/security" />
              <SettingsRow icon="📋" label={t.impressum} href="/impressum" last />
            </div>
          </>
        )}
      </section>
      <FooterDisclaimer language={language} />
    </main>
  );
}
