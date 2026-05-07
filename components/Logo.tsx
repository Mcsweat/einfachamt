type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-trust-500 text-base font-black text-white shadow-soft">
        EA
      </div>
      {!compact ? (
        <span className="truncate text-[21px] font-bold tracking-tight text-ink">
          EinfachAmt
        </span>
      ) : null}
    </div>
  );
}
