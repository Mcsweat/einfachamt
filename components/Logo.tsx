type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <img
        src="/einfachamt-icon.png"
        alt=""
        aria-hidden="true"
        className="h-10 w-10 shrink-0 rounded-[15px] object-cover shadow-sm"
      />
      {!compact ? (
        <span className="whitespace-nowrap text-[20px] font-black tracking-normal text-ink">
          Einfach<span className="text-trust-500">Amt</span>
        </span>
      ) : null}
    </div>
  );
}
