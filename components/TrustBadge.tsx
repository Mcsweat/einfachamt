type TrustBadgeProps = {
  label: string;
  tone?: "blue" | "green" | "gray";
};

const toneClasses = {
  blue: "bg-trust-100 text-trust-700",
  green: "bg-emerald-100 text-emerald-700",
  gray: "bg-slate-100 text-slate-700",
};

export function TrustBadge({ label, tone = "blue" }: TrustBadgeProps) {
  return (
    <div
      className={`flex min-h-12 items-center rounded-2xl px-4 py-3 text-base font-bold ${toneClasses[tone]}`}
    >
      {label}
    </div>
  );
}
