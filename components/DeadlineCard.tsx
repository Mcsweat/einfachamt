type DeadlineCardProps = {
  deadlines: string[];
};

export function DeadlineCard({ deadlines }: DeadlineCardProps) {
  return (
    <section className="rounded-3xl border border-trust-200 bg-trust-50 p-5">
      <h2 className="text-xl font-bold text-ink">Wichtige Fristen</h2>
      <div className="mt-4 space-y-3">
        {deadlines.map((deadline) => (
          <div
            key={deadline}
            className="rounded-2xl border border-trust-100 bg-white p-4 text-base font-semibold text-trust-700"
          >
            {deadline}
          </div>
        ))}
      </div>
    </section>
  );
}
