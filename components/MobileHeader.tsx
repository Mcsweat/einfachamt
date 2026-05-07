import Link from "next/link";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { type Language } from "@/lib/i18n";

type MobileHeaderProps = {
  title?: string;
  backHref?: string;
  language?: Language;
  languageLabel?: string;
  backLabel?: string;
};

export function MobileHeader({
  title = "EinfachAmt",
  backHref,
  language = "de",
  languageLabel,
  backLabel = "Zurück",
}: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-trust-50/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[430px] items-center gap-3 px-4">
        {backHref ? (
          <Link
            href={backHref}
            aria-label={backLabel}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/90 text-2xl font-semibold text-trust-500 shadow-sm"
          >
            ‹
          </Link>
        ) : null}
        <Link href="/" className="min-w-0 flex-1" aria-label="EinfachAmt Startseite">
          {title === "EinfachAmt" ? (
            <Logo />
          ) : (
            <span className="block truncate text-[17px] font-semibold text-slate-700">
              {title}
            </span>
          )}
        </Link>
        <LanguageToggle active={language} label={languageLabel} />
      </div>
    </header>
  );
}
