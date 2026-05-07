import Link from "next/link";

type StickyCTAProps = {
  href: string;
  label: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function StickyCTA({
  href,
  label,
  secondaryHref,
  secondaryLabel,
}: StickyCTAProps) {
  return (
    <div className="sticky bottom-0 z-20 bg-white/70 px-4 pb-5 pt-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[430px] flex-col gap-2">
        <Link
          href={href}
          className="flex min-h-14 items-center justify-center rounded-full bg-trust-500 px-5 py-4 text-center text-[17px] font-bold text-white shadow-soft transition hover:bg-trust-700 active:scale-[0.98]"
        >
          {label}
        </Link>
        {secondaryHref && secondaryLabel ? (
          <Link
            href={secondaryHref}
            className="flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-center font-bold text-trust-500 transition hover:bg-trust-100"
          >
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
