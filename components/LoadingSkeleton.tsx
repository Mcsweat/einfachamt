export function LoadingSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="h-28 animate-pulse rounded-[1.75rem] bg-white/80" />
      <div className="h-20 animate-pulse rounded-[1.75rem] bg-white/70" />
      <div className="h-24 animate-pulse rounded-[1.75rem] bg-white/60" />
    </div>
  );
}
