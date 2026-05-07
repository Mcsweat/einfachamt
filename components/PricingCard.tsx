type PricingCardProps = {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export function PricingCard({
  name,
  price,
  description,
  features,
  highlighted = false,
}: PricingCardProps) {
  return (
    <article
      className={`rounded-[1.65rem] p-5 shadow-sm ${
        highlighted ? "bg-trust-500 text-white" : "bg-white/95 text-ink"
      }`}
    >
      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="mt-2 text-4xl font-black">{price}</p>
      <p
        className={`mt-3 text-lg leading-7 ${
          highlighted ? "text-white/90" : "text-slate-700"
        }`}
      >
        {description}
      </p>
      <ul className="mt-5 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3 text-base font-semibold">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm ${
                highlighted
                  ? "bg-white/20 text-white"
                  : "bg-emerald-100 text-emerald-700"
              }`}
              aria-hidden="true"
            >
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
