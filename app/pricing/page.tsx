import Link from "next/link";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
import { PricingCard } from "@/components/PricingCard";
import { copy } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";
import { getSafeUser } from "@/lib/supabase/safe-auth";
import { PricingCheckoutButton } from "./PricingCheckoutButton";

type PricingPageProps = {
  searchParams?: Promise<{
    checkout?: string;
  }>;
};

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const params = await searchParams;
  const checkout = params?.checkout;
  const language = await getLanguage();
  const t = copy[language];
  const user = await getSafeUser();
  const isLoggedIn = Boolean(user && !user.is_anonymous);

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader
        title={t.pricing}
        backHref="/"
        language={language}
        languageLabel={t.languageLabel}
        backLabel={t.back}
        accountLabel={t.account}
        loginLabel={t.login}
      />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          {t.pricingPageTitle}
        </h1>
        <p className="mt-4 text-xl leading-8 text-slate-700">
          {t.pricingPageIntro}
        </p>

        {checkout === "success" ? (
          <p className="mt-5 rounded-[1.25rem] bg-emerald-50 p-4 text-base font-bold leading-6 text-emerald-800">
            {t.checkoutSuccess}
          </p>
        ) : null}

        {checkout === "cancelled" ? (
          <p className="mt-5 rounded-[1.25rem] bg-amber-50 p-4 text-base font-bold leading-6 text-amber-900">
            {t.checkoutCancelled}
          </p>
        ) : null}

        <div className="mt-7 space-y-4">
          <PricingCard
            name={t.plans.free.name}
            price={t.plans.free.price}
            description={t.plans.free.description}
            features={[...t.plans.free.features]}
          />
          <PricingCard
            name={t.plans.plus.name}
            price={t.plans.plus.price}
            description={t.plans.plus.description}
            highlighted
            features={[...t.plans.plus.features]}
          />
          <PricingCard
            name={t.plans.premium.name}
            price={t.plans.premium.price}
            description={t.plans.premium.description}
            features={[...t.plans.premium.features]}
          />
        </div>

        <PricingCheckoutButton isLoggedIn={isLoggedIn} language={language} />

        <Link
          href="/upload"
          className="mt-3 flex min-h-14 items-center justify-center rounded-full bg-trust-100 px-5 py-4 text-center text-lg font-bold text-trust-700"
        >
          {t.startFree}
        </Link>
      </section>
      <FooterDisclaimer language={language} />
    </main>
  );
}
