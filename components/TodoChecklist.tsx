type TodoChecklistProps = {
  todos: string[];
  title?: string;
};

export function TodoChecklist({
  todos,
  title = "Was du tun solltest",
}: TodoChecklistProps) {
  return (
    <section className="rounded-[1.55rem] bg-white/95 p-5 shadow-sm">
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <ul className="mt-4 space-y-3">
        {todos.map((todo) => (
          <li key={todo} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-base font-bold text-emerald-700"
            >
              ✓
            </span>
            <span className="text-lg font-semibold leading-7 text-slate-800">
              {todo}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
