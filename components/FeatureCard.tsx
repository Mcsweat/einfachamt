type FeatureCardProps = {
  title: string;
  description: string;
};

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <article className="rounded-3xl border border-trust-100 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-ink">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600">{description}</p>
    </article>
  );
}
