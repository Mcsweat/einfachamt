"use client";

type EditableDraftProps = {
  value: string;
  onChange: (value: string) => void;
};

export function EditableDraft({ value, onChange }: EditableDraftProps) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-[320px] w-full resize-y rounded-3xl border border-trust-100 bg-white p-5 leading-7 text-slate-800 shadow-sm outline-none focus:border-trust-500 focus:ring-4 focus:ring-trust-100"
      aria-label="Antwortentwurf bearbeiten"
    />
  );
}
