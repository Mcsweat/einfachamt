import { copy, type Language } from "@/lib/i18n";

type TrustSignalListProps = {
  compact?: boolean;
  language?: Language;
};

export function TrustSignalList({
  compact = false,
  language = "de",
}: TrustSignalListProps) {
  const t = copy[language];

  return (
    <section className={compact ? "space-y-2" : "rounded-[1.4rem] bg-white/95 p-5 shadow-sm"}>
      {!compact ? (
        <>
          <h2 className="text-xl font-bold text-ink">{t.trustTitle}</h2>
          <p className="mt-2 text-base leading-7 text-slate-700">
            {language === "en"
              ? "EinfachAmt is a private service. We explain clearly what happens with your letter."
              : "EinfachAmt ist ein privater Dienst. Wir erklären klar, was mit deinem Brief passiert."}
          </p>
        </>
      ) : null}
      <div className={compact ? "grid gap-2" : "mt-4 grid gap-2"}>
        {t.trustItems.map((signal) => (
          <div
            key={signal}
            className="flex min-h-11 items-center gap-3 rounded-2xl bg-trust-50 px-4 py-3"
          >
            <span
              aria-hidden="true"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700"
            >
              ✓
            </span>
            <span className="text-base font-semibold text-slate-800">
              {signal}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
