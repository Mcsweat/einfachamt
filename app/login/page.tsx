import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import { MobileHeader } from "@/components/MobileHeader";
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

  return (
    <main className="min-h-svh bg-trust-50">
      <MobileHeader title="Einloggen" backHref={nextPath} />
      <section className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">
        <h1 className="text-4xl font-bold leading-tight text-ink">
          Plus-Zugang sichern
        </h1>
        <p className="mt-4 text-xl leading-8 text-slate-700">
          Melde dich mit deiner E-Mail an, damit dein Abo auch auf einem neuen
          Handy oder Browser erhalten bleibt.
        </p>
        {params?.reason === "plus" ? (
          <p className="mt-5 rounded-[1.25rem] bg-trust-100 p-4 text-base font-bold leading-6 text-trust-700">
            Fuer Plus brauchst du ein Konto. Danach geht es direkt weiter zu Stripe.
          </p>
        ) : null}
        <LoginForm nextPath={nextPath} />
      </section>
      <FooterDisclaimer />
    </main>
  );
}
