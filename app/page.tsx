import Link from "next/link";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { copy, type Language } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { getSafeUser } from "@/lib/supabase/safe-auth";
import { ogImage } from "@/lib/og";

function LetterPreview({ language }: { language: Language }) {
  const isDe = language === "de";
  return (
    <div className="mt-7 overflow-hidden rounded-[1.65rem] bg-white/95 shadow-sm">
      {/* Header bar */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
        <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
          {isDe ? "Beispiel-Ergebnis" : "Example result"}
        </span>
      </div>

      <div className="space-y-3 p-5">
        {/* What it's about */}
        <div className="flex items-start gap-3 rounded-2xl bg-trust-50 px-4 py-3">
          <span className="mt-0.5 text-xl">📋</span>
          <div>
            <p className="text-sm font-bold text-ink">
              {isDe ? "Um was geht es?" : "What is it about?"}
            </p>
            <p className="mt-0.5 text-sm leading-6 text-slate-700">
              {isDe
                ? "Das Jobcenter fordert dich auf, fehlende Unterlagen nachzureichen, damit deine Leistungen weiterlaufen."
                : "The Jobcenter asks you to submit missing documents so your benefits continue."}
            </p>
          </div>
        </div>

        {/* Deadline */}
        <div className="flex items-start gap-3 rounded-2xl bg-amber-50 px-4 py-3">
          <span className="mt-0.5 text-xl">⏰</span>
          <div>
            <p className="text-sm font-bold text-amber-900">
              {isDe ? "Frist: 14.03.2026" : "Deadline: 14 March 2026"}
            </p>
            <p className="mt-0.5 text-sm leading-6 text-amber-800">
              {isDe
                ? "Antworte bis zu diesem Datum, sonst können Leistungen unterbrochen werden."
                : "Reply by this date, otherwise your benefits may be interrupted."}
            </p>
          </div>
        </div>

        {/* Reply ready */}
        <div className="flex items-center gap-3 rounded-2xl bg-green-50 px-4 py-3">
          <span className="text-xl">✉️</span>
          <p className="text-sm font-bold text-green-900">
            {isDe ? "Antwortentwurf fertig — einfach kopieren" : "Reply draft ready — just copy and send"}
          </p>
        </div>
      </div>
    </div>
  );
}

function TrustRow({ language }: { language: Language }) {
  const isDe = language === "de";
  const items = isDe
    ? [
        { icon: "🇪🇺", label: "EU Frankfurt" },
        { icon: "🔒", label: "Verschlüsselt" },
        { icon: "🚫", label: "Kein Tracking" },
        { icon: "📋", label: "DSGVO" },
      ]
    : [
        { icon: "🇪🇺", label: "EU Frankfurt" },
        { icon: "🔒", label: "Encrypted" },
        { icon: "🚫", label: "No tracking" },
        { icon: "📋", label: "GDPR" },
      ];
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.label}
          href="/security"
          className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-sm font-bold text-slate-700 shadow-sm transition active:scale-[0.97]"
        >
          <span>{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export async function generateMetadata() {
  const language = await getLanguage();
  const isDe = language === "de";
  const title = isDe
    ? "Jobcenter-Briefe verstehen | EinfachAmt"
    : "Understand Jobcenter letters | EinfachAmt";
  const description = isDe
    ? "Behördenbriefe in 30 Sekunden verstehen. EinfachAmt erklärt Jobcenter- und Bürgergeld-Bescheide in einfacher Sprache — kostenlos testen."
    : "Understand government letters in 30 seconds. EinfachAmt explains Jobcenter and Bürgergeld notices in plain language — free to try.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://einfachamt.com",
      siteName: "EinfachAmt",
      locale: isDe ? "de_DE" : "en_GB",
      images: ogImage,
    },
  };
}

export default async function LandingPage() {
  const language = await getLanguage();
  const t = copy[language];
  const user = await getSafeUser();
  const isEmailUser = Boolean(user && !user.is_anonymous);

  return (
    <main className="min-h-svh bg-trust-50">
      <section className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col px-4 pb-28 pt-8">

        {/* Nav */}
        <div className="flex items-center justify-between gap-3">
          <Link href="/" aria-label="EinfachAmt Startseite">
            <Logo />
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={isEmailUser ? "/account" : "/login?next=/account"}
              className="flex min-h-10 items-center justify-center rounded-full bg-white/90 px-3 text-sm font-bold text-trust-700 shadow-sm"
            >
              {isEmailUser ? t.account : t.login}
            </Link>
            <LanguageToggle active={language} label={t.languageLabel} />
          </div>
        </div>

        {/* Hero */}
        <div className="flex flex-1 flex-col justify-center py-9">
          <p className="mb-4 inline-flex w-fit rounded-full bg-white/90 px-4 py-2 text-base font-semibold text-trust-500 shadow-sm">
            {t.heroEyebrow}
          </p>
          <h1 className="text-[44px] font-bold leading-[1.04] tracking-normal text-ink">
            {t.heroTitle}
          </h1>
          <p className="mt-5 text-xl leading-8 text-slate-700">
            {t.heroSubtitle}
          </p>
          <div className="mt-7 grid gap-3">
            <Link
              href="/upload"
              className="flex min-h-16 w-full items-center justify-center rounded-full bg-trust-500 px-6 py-5 text-center text-xl font-bold text-white shadow-soft transition hover:bg-trust-700 active:scale-[0.98]"
            >
              {t.uploadCta}
            </Link>
            {isEmailUser && (
              <Link
                href="/dashboard"
                className="flex min-h-14 w-full items-center justify-center rounded-full bg-trust-100 px-6 py-4 text-center text-lg font-bold text-trust-700 transition active:scale-[0.98]"
              >
                {t.dashboardCta}
              </Link>
            )}
          </div>
        </div>

        {/* Bürgergeld Antrag — featured tool card */}
        <Link
          href="/antrag"
          className="mt-3 flex items-center gap-4 overflow-hidden rounded-[1.55rem] bg-trust-500 px-5 py-4 shadow-soft transition active:scale-[0.98]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl">
            📋
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-base font-bold text-white">
                {language === "de" ? "Bürgergeld-Antrag" : language === "ar" ? "طلب Bürgergeld" : language === "tr" ? "Bürgergeld Başvurusu" : language === "uk" ? "Заява Bürgergeld" : language === "ru" ? "Заявка Bürgergeld" : "Bürgergeld Application"}
              </p>
              <span className="shrink-0 rounded-full bg-white/25 px-2 py-0.5 text-xs font-black text-white">
                39,99 €/Mo
              </span>
            </div>
            <p className="mt-0.5 text-sm leading-5 text-white/80">
              {language === "de" ? "Formular automatisch ausfüllen" : language === "ar" ? "ملء النموذج تلقائياً" : language === "tr" ? "Formu otomatik doldur" : language === "uk" ? "Автозаповнення форми" : language === "ru" ? "Автозаполнение формы" : "Auto-fill the form"}
            </p>
          </div>
          <span className="shrink-0 text-xl font-semibold text-white/60">›</span>
        </Link>

        {/* Letter preview mockup */}
        <LetterPreview language={language} />

        {/* How it works */}
        <section className="mt-5 rounded-[1.65rem] bg-white/95 p-5 shadow-sm">
          <h2 className="text-2xl font-bold text-ink">{t.howItWorks}</h2>
          <div className="mt-5 space-y-4">
            {t.steps.map(([title, text], index) => (
              <article key={title} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-trust-100 text-lg font-black text-trust-500">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-[21px] font-bold leading-7 text-ink">
                    {title}
                  </h3>
                  <p className="mt-1 text-[17px] leading-7 text-slate-700">
                    {text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* What it helps with */}
        <section className="mt-5 rounded-[1.65rem] bg-white/95 p-5 shadow-sm">
          <h2 className="text-2xl font-bold text-ink">{t.helpsTitle}</h2>
          <div className="mt-3 divide-y divide-slate-100">
            {[...t.helpAreas].map((item) => (
              <div key={item} className="flex min-h-12 items-center gap-3 py-2">
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-trust-100 text-sm font-bold text-trust-500"
                >
                  ✓
                </span>
                <span className="text-[17px] font-semibold leading-6 text-slate-800">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Trust section */}
        <section className="mt-5 rounded-[1.65rem] bg-white/95 p-5 shadow-sm">
          <h2 className="text-2xl font-bold text-ink">{t.trustTitle}</h2>
          <div className="mt-4">
            <TrustRow language={language} />
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {[...t.trustItems].map((item) => (
              <div key={item} className="flex min-h-12 items-center gap-3 py-2">
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-trust-100 text-sm font-bold text-trust-500"
                >
                  ✓
                </span>
                <span className="text-[17px] font-semibold leading-6 text-slate-800">
                  {item}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/security"
            className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-trust-500 underline-offset-2 hover:underline"
          >
            {language === "de" ? "Mehr zur Sicherheit →" : "More about security →"}
          </Link>
        </section>

        {/* Tools */}
        <section className="mt-5 space-y-3">
          <h2 className="text-2xl font-bold text-ink">
            {language === "de" ? "Weitere Werkzeuge" : language === "ar" ? "أدوات إضافية" : language === "tr" ? "Diğer araçlar" : language === "uk" ? "Інші інструменти" : language === "ru" ? "Другие инструменты" : "More tools"}
          </h2>

          {/* Widerspruch */}
          <Link
            href="/widerspruch"
            className="flex items-center gap-4 rounded-[1.55rem] bg-white/95 p-5 shadow-sm transition active:scale-[0.98]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
              ✊
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-ink">{language === "de" ? "Widerspruch einlegen" : language === "ar" ? "تقديم اعتراض" : language === "tr" ? "İtiraz et" : language === "uk" ? "Подати скаргу" : language === "ru" ? "Подать жалобу" : "File an appeal"}</p>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-black uppercase tracking-wide text-amber-800">
                  {language === "de" ? "Kostenlos" : "Free"}
                </span>
              </div>
              <p className="mt-0.5 text-sm leading-5 text-slate-600">
                {language === "de" ? "Widerspruchsbrief in 3 Schritten erstellen" : language === "ar" ? "إنشاء خطاب اعتراض في 3 خطوات" : language === "tr" ? "3 adımda itiraz mektubu oluştur" : language === "uk" ? "Створіть лист-скаргу за 3 кроки" : language === "ru" ? "Создайте письмо-жалобу за 3 шага" : "Create an appeal letter in 3 steps"}
              </p>
            </div>
            <span className="text-slate-300">›</span>
          </Link>

          {/* Antrag */}
          <Link
            href="/antrag"
            className="flex items-center gap-4 rounded-[1.55rem] bg-white/95 p-5 shadow-sm transition active:scale-[0.98]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-trust-100 text-2xl">
              📄
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-ink">{language === "de" ? "Bürgergeld-Antrag ausfüllen" : language === "ar" ? "ملء طلب Bürgergeld" : language === "tr" ? "Bürgergeld başvurusunu doldur" : language === "uk" ? "Заповнити заяву Bürgergeld" : language === "ru" ? "Заполнить заявку Bürgergeld" : "Fill Bürgergeld application"}</p>
                <span className="rounded-full bg-trust-100 px-2 py-0.5 text-xs font-black uppercase tracking-wide text-trust-700">
                  39,99 €
                </span>
              </div>
              <p className="mt-0.5 text-sm leading-5 text-slate-600">
                {language === "de" ? "Formular automatisch ausfüllen — als PDF herunterladen" : language === "ar" ? "ملء النموذج تلقائياً وتنزيله كـ PDF" : language === "tr" ? "Formu otomatik doldur — PDF olarak indir" : language === "uk" ? "Автоматично заповнити та завантажити PDF" : language === "ru" ? "Автозаполнение и скачивание PDF" : "Auto-fill the form — download as PDF"}
              </p>
            </div>
            <span className="text-slate-300">›</span>
          </Link>
        </section>

        {/* Pricing */}
        <section className="mt-5 rounded-[1.65rem] bg-white/95 p-5 shadow-sm">
          <h2 className="text-2xl font-bold text-ink">{t.pricingTitle}</h2>
          <p className="mt-2 text-lg leading-7 text-slate-700">
            {t.pricingText}
          </p>
          <Link
            href="/pricing"
            className="mt-4 inline-flex min-h-12 items-center rounded-full bg-trust-100 px-5 py-3 text-base font-bold text-trust-700"
          >
            {t.pricingLink}
          </Link>
        </section>

        {/* Bottom CTA */}
        <div className="mt-5">
          <Link
            href="/upload"
            className="flex min-h-16 w-full items-center justify-center rounded-full bg-trust-500 px-6 py-5 text-center text-xl font-bold text-white shadow-soft transition hover:bg-trust-700 active:scale-[0.98]"
          >
            {language === "de" ? "Jetzt kostenlos testen →" : "Try for free now →"}
          </Link>
          <p className="mt-3 text-center text-sm text-slate-500">
            {language === "de"
              ? "Kein Konto nötig. Ein Brief gratis."
              : "No account needed. One letter free."}
          </p>
        </div>

      </section>

      <FooterDisclaimer language={language} />
    </main>
  );
}
