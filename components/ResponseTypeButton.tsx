type ResponseTypeButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export function ResponseTypeButton({
  label,
  active,
  onClick,
}: ResponseTypeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-4 text-left text-sm font-bold transition ${
        active
          ? "border-trust-700 bg-trust-700 text-white shadow-soft"
          : "border-trust-100 bg-white text-ink hover:bg-trust-50"
      }`}
    >
      {label}
    </button>
  );
}
