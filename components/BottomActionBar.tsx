type BottomActionBarProps = {
  children: React.ReactNode;
};

export function BottomActionBar({ children }: BottomActionBarProps) {
  return (
    <div className="sticky bottom-0 z-20 bg-white/70 px-4 pb-5 pt-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[430px] flex-col gap-2">{children}</div>
    </div>
  );
}
