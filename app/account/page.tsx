import Link from "next/link";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { DocumentCard } from "@/components/DocumentCard";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { getSafeUser } from "@/lib/supabase/safe-auth";
import { getCurrentUserSubscription } from "@/lib/subscription";
import { getSavedDocuments, getMonthlyUploadCount } from "@/lib/saved-documents";
import { getCurrentUserAntragSubscription } from "@/lib/subscription";
import { UsagePill } from "@/components/UsagePill";
import { SignOutButton } from "./AccountActions";
import { ManageSubscriptionButton } from "@/components/ManageSubscriptionButton";

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
  const [subscription, antragSubscription, { documents }, monthlyCount] = await Promise.all([
    getCurrentUserSubscription(),
    getCurrentUserAntragSubscription(),
    getSavedDocuments(language === "de" ? "de-DE" : "en-US"),
    getMonthlyUploadCount(),
  ]);
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
                href={subscription.isPaid ? undefined : "/pricing"}
                last={!subscription.isPaid}
              />
              {subscription.isPaid && (
                <ManageSubscriptionButton
                  label={language === "de" ? "Abo verwalten / kündigen" : "Manage / cancel subscription"}
                  loadingLabel={language === "de" ? "Weiterleitung…" : "Redirecting…"}
                />
              )}
            </div>

            {/* Usage counter */}
            <div className="mt-4">
              <UsagePill
                isPaid={subscription.isPaid}
                isLoggedIn={isEmailUser}
                monthlyCount={monthlyCount}
                limit={subscription.isPaid ? 50 : 1}
                language={language}
              />
            </div>

            {/* Tools / Dienste section */}
            <SectionLabel>{t.toolsSection}</SectionLabel>
            <Link
              href="/antrag"
              className={`flex items-center gap-4 overflow-hidden rounded-[1.55rem] p-5 shadow-sm transition active:scale-[0.98] ${
                antragSubscription.isPaid
                  ? "bg-trust-500 text-white"
                  : "bg-white/95 text-ink"
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[0.9rem] text-2xl ${
                  antragSubscription.isPaid ? "bg-white/20" : "bg-trust-100"
                }`}
              >
                📋
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-base font-bold ${antragSubscription.isPaid ? "text-white" : "text-ink"}`}>
                    {t.antrag.title}
                  </p>
                  {antragSubscription.isPaid ? (
                    <span className="rounded-full bg-white/25 px-2 py-0.5 text-xs font-black text-white">
                      ✓ Aktiv
                    </span>
                  ) : (
                    <span className="rounded-full bg-trust-100 px-2 py-0.5 text-xs font-black text-trust-700">
                      39,99 €/Monat
                    </span>
                  )}
                </div>
                <p className={`mt-0.5 text-sm leading-5 ${antragSubscription.isPaid ? "text-white/75" : "text-slate-500"}`}>
                  {t.antrag.intro}
                </p>
              </div>
              <span className={`shrink-0 text-xl font-semibold ${antragSubscription.isPaid ? "text-white/60" : "text-slate-300"}`}>
                ›
              </span>
            </Link>

            {/* Briefe section */}
            <SectionLabel>{t.dashboardTitle}</SectionLabel>
            {documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    labels={{
                      renameLetter: t.renameLetter,
                      renameLetterSave: t.renameLetterSave,
                      renameLetterCancel: t.renameLetterCancel,
                      deleteLetter: t.deleteLetter,
                      deletingLetter: t.deletingLetter,
                      deleteLetterConfirm: t.deleteLetterConfirm,
                      deleteLetterError: t.deleteLetterError,
                      statusAnalyzed: t.statusAnalyzed,
                      statusReading: t.statusReading,
                      statusUploaded: t.statusUploaded,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-[1.55rem] bg-white/95 px-5 py-8 text-center shadow-sm">
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
