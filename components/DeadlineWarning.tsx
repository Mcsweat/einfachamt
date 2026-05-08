type DeadlineWarningProps = {
  deadline: string;
  title?: string;
  hint?: string;
};

export function DeadlineWarning({
  deadline,
  title = "Wichtige Frist",
  hint = "Am besten heute eine kurze Antwort vorbereiten.",
}: DeadlineWarningProps) {
  return (
    <section className="rounded-[1.55rem] border border-amber-200 bg-amber-50 p-5 shadow-sm">
      <div className="flex gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-xl font-bold text-amber-700"
        >
          !
        </span>
        <div>
          <h2 className="text-xl font-bold text-ink">{title}</h2>
          <p className="mt-2 text-lg font-bold leading-7 text-amber-900">
            {deadline}
          </p>
          <p className="mt-2 leading-7 text-slate-700">
            {hint}
          </p>
        </div>
      </div>
    </section>
  );
}
