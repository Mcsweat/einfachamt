import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { Logo } from "@/components/Logo";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { LoginForm } from "./LoginForm";

type LoginPageProps = {
  searchParams?: Promise<{
    next?: string;
    reason?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params?.next?.startsWith("/") ? params.next : "/pricing";
  const language = await getLanguage();
  const t = copy[language];

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={t.login}
        backHref={nextPath}
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-8">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-5 text-3xl font-bold leading-tight text-ink">
            {t.loginTitle}
          </h1>
          <p className="mt-3 max-w-[320px] text-base leading-7 text-slate-700">
            {t.loginIntro}
          </p>
        </div>

        {params?.reason === "plus" ? (
          <p className="mt-5 rounded-[1.25rem] bg-trust-100 p-4 text-base font-bold leading-6 text-trust-700">
            {t.plusNeedsAccount}
          </p>
        ) : null}

        <LoginForm nextPath={nextPath} language={language} />

        <div className="mt-6 flex items-center justify-center gap-3 text-sm text-slate-500">
          <span>{t.loginNoPassword}</span>
          <span aria-hidden="true">·</span>
          <span>{t.loginSecure}</span>
          <span aria-hidden="true">·</span>
          <span>{t.loginEuData}</span>
        </div>
      </section>
      <FooterDisclaimer language={language} />
    </main>
  );
}
