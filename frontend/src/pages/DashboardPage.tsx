import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getTodos } from "../api/todos.api";
import type { Todo } from "../types/todo";

export function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getTodos();

        setTodos(response.results);
      } catch {
        setError("Unable to load your todos.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadTodos();
  }, []);

  const completed = todos.filter(
    (todo) => todo.status === "completed",
  ).length;

  const pending = todos.filter(
    (todo) => todo.status === "pending",
  ).length;

  const inProgress = todos.filter(
    (todo) => todo.status === "in_progress",
  ).length;

  return (
    <div className="mx-auto w-full max-w-6xl p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#616061] dark:text-[#9b9b9b]">
            Workspace
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1d1c1d] dark:text-white">
            All Todos
          </h1>

          <p className="mt-1 text-sm text-[#616061] dark:text-[#9b9b9b]">
            Manage everything you're working on.
          </p>
        </div>

        <button
          type="button"
          className="rounded-md bg-[#611f69] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4a154b] focus:outline-none focus:ring-2 focus:ring-[#611f69] focus:ring-offset-2 dark:focus:ring-offset-[#1a1d21]"
        >
          + Add Todo
        </button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat
          label="Total"
          value={todos.length}
        />

        <Stat
          label="Pending"
          value={pending}
        />

        <Stat
          label="In Progress"
          value={inProgress}
        />

        <Stat
          label="Completed"
          value={completed}
        />
      </div>

      {/* Todo section */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1d1c1d] dark:text-white">
            Your Todos
          </h2>

          <span className="text-sm text-[#616061] dark:text-[#9b9b9b]">
            {todos.length} items
          </span>
        </div>

        {isLoading && (
          <div className="rounded-lg border border-[#ddd] bg-white p-8 text-center dark:border-white/10 dark:bg-[#222529]">
            <p className="text-sm text-[#616061] dark:text-[#9b9b9b]">
              Loading your todos...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}

        {!isLoading && !error && todos.length === 0 && (
          <div className="rounded-lg border border-dashed border-[#ccc] bg-white p-12 text-center dark:border-white/10 dark:bg-[#222529]">
            <div className="text-3xl">✓</div>

            <h3 className="mt-3 font-semibold text-[#1d1c1d] dark:text-white">
              No todos yet
            </h3>

            <p className="mt-1 text-sm text-[#616061] dark:text-[#9b9b9b]">
              Create your first todo to get started.
            </p>
          </div>
        )}

        {!isLoading && !error && todos.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-[#ddd] bg-white dark:border-white/10 dark:bg-[#222529]">
            {todos.map((todo) => (
              <TodoRow
                key={todo.id}
                todo={todo}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-[#ddd] bg-white p-4 dark:border-white/10 dark:bg-[#222529]">
      <p className="text-xs font-medium uppercase tracking-wide text-[#616061] dark:text-[#9b9b9b]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-[#1d1c1d] dark:text-white">
        {value}
      </p>
    </div>
  );
}

function TodoRow({ todo }: { todo: Todo }) {
  const statusLabel = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
  }[todo.status];

  const priorityLabel = {
    1: "Low",
    2: "Medium",
    3: "High",
    4: "Urgent",
  }[todo.priority];

  return (
    <article className="group border-b border-[#eee] px-5 py-4 last:border-b-0 hover:bg-[#f8f8f8] dark:border-white/10 dark:hover:bg-white/[0.03]">
      <div className="flex items-start gap-4">
        <button
          type="button"
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#aaa] text-xs transition hover:border-[#611f69] hover:bg-[#611f69] hover:text-white dark:border-[#777]"
          aria-label={`Mark ${todo.title} as completed`}
        >
          {todo.status === "completed" ? "✓" : ""}
        </button>

        <div className="min-w-0 flex-1">
          <h3
            className={`font-medium ${
              todo.status === "completed"
                ? "text-[#888] line-through"
                : "text-[#1d1c1d] dark:text-white"
            }`}
          >
            {todo.title}
          </h3>

          {todo.description && (
            <p className="mt-1 line-clamp-2 text-sm text-[#616061] dark:text-[#9b9b9b]">
              {todo.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge>{statusLabel}</Badge>
            <Badge>Priority: {priorityLabel}</Badge>

            {todo.due_date && (
              <Badge>
                Due:{" "}
                {new Date(todo.due_date).toLocaleDateString()}
              </Badge>
            )}
          </div>
        </div>

        <button
          type="button"
          className="hidden rounded px-2 py-1 text-sm text-[#616061] hover:bg-[#ddd] group-hover:block dark:text-[#aaa] dark:hover:bg-white/10"
          aria-label={`Open ${todo.title}`}
        >
          •••
        </button>
      </div>
    </article>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-[#f1f1f1] px-2 py-1 text-xs text-[#616061] dark:bg-white/10 dark:text-[#bdbdbd]">
      {children}
    </span>
  );
}
