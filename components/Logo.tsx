type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[15px] bg-gradient-to-br from-sky-300 to-trust-500 shadow-sm">
        <span
          aria-hidden="true"
          className="absolute bottom-2.5 left-3 h-2.5 w-2.5 rounded-[3px] bg-white/45"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-2.5 left-[1.15rem] h-[1.125rem] w-3 rounded-[3px] bg-white/55"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-2.5 right-3 h-[1.65rem] w-3 rounded-[3px] bg-white/65"
        />
        <span
          aria-hidden="true"
          className="absolute left-2.5 top-[1.45rem] h-2.5 w-6 -rotate-[1deg] rounded-full bg-white"
        />
        <span
          aria-hidden="true"
          className="absolute left-[1.08rem] top-[1.36rem] h-2.5 w-7 -rotate-45 rounded-full bg-white"
        />
      </div>
      {!compact ? (
        <span className="whitespace-nowrap text-[20px] font-black tracking-normal text-ink">
          Einfach<span className="text-trust-500">Amt</span>
        </span>
      ) : null}
    </div>
  );
}
