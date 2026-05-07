type DeadlineWarningProps = {
  deadline: string;
};

export function DeadlineWarning({ deadline }: DeadlineWarningProps) {
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
          <h2 className="text-xl font-bold text-ink">Wichtige Frist</h2>
          <p className="mt-2 text-lg font-bold leading-7 text-amber-900">
            {deadline}
          </p>
          <p className="mt-2 leading-7 text-slate-700">
            Am besten heute eine kurze Antwort vorbereiten.
          </p>
        </div>
      </div>
    </section>
  );
}
