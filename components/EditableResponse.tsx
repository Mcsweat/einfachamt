"use client";

type EditableResponseProps = {
  value: string;
  onChange: (value: string) => void;
};

export function EditableResponse({ value, onChange }: EditableResponseProps) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-[360px] w-full resize-none rounded-[1.55rem] border border-slate-200 bg-white/95 p-5 text-lg leading-8 text-slate-900 shadow-sm outline-none transition focus:border-trust-500 focus:ring-4 focus:ring-trust-100"
      aria-label="Antwort bearbeiten"
    />
  );
}
