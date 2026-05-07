type AnalysisCardProps = {
  title: string;
  icon?: string;
  children: React.ReactNode;
};

export function AnalysisCard({ title, icon, children }: AnalysisCardProps) {
  return (
    <section className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        {icon ? (
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-trust-100 text-xl font-bold text-trust-500"
          >
            {icon}
          </span>
        ) : null}
        <div>
          <h2 className="text-xl font-bold text-ink">{title}</h2>
          <div className="mt-2 text-lg leading-8 text-slate-700">{children}</div>
        </div>
      </div>
    </section>
  );
}
