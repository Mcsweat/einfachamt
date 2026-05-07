type TodoListProps = {
  todos: string[];
};

export function TodoList({ todos }: TodoListProps) {
  return (
    <section className="rounded-3xl border border-trust-100 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-ink">Was du jetzt tun solltest</h2>
      <ul className="mt-4 space-y-3">
        {todos.map((todo, index) => (
          <li key={todo} className="flex gap-3 rounded-2xl bg-trust-50 p-4">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-trust-700 text-sm font-bold text-white">
              {index + 1}
            </span>
            <span className="font-medium text-slate-700">{todo}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
