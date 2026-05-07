type SimpleListCardProps = {
  title: string;
  items: string[];
};

export function SimpleListCard({ title, items }: SimpleListCardProps) {
  return (
    <section className="rounded-[1.65rem] bg-white/95 p-5 shadow-sm">
      <h2 className="text-2xl font-bold text-ink">{title}</h2>
      <div className="mt-3 divide-y divide-slate-100">
        {items.map((item) => (
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
  );
}
