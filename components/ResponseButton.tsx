type ResponseButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export function ResponseButton({ label, active, onClick }: ResponseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-16 rounded-[1.35rem] border px-5 py-4 text-left text-lg font-bold leading-6 shadow-sm transition active:scale-[0.99] ${
        active
          ? "border-trust-500 bg-trust-500 text-white"
          : "border-slate-200 bg-white/95 text-ink hover:bg-trust-100"
      }`}
    >
      {label}
    </button>
  );
}
