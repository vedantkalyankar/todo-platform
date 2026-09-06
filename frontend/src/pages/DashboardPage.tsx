import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../api/todos.api";
import type {
  CreateTodoRequest,
  Todo,
  TodoPriority,
  TodoStatus,
  UpdateTodoRequest,
} from "../types/todo";

type TodoFormState = {
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  due_date: string;
};

const emptyForm: TodoFormState = {
  title: "",
  description: "",
  status: "pending",
  priority: 2,
  due_date: "",
};

export function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [form, setForm] = useState<TodoFormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [actionTodoId, setActionTodoId] = useState<string | null>(null);

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

  useEffect(() => {
    void loadTodos();
  }, []);

  const openCreateModal = () => {
    setEditingTodo(null);
    setForm(emptyForm);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);

    setForm({
      title: todo.title,
      description: todo.description,
      status: todo.status,
      priority: todo.priority,
      due_date: todo.due_date
        ? todo.due_date.slice(0, 16)
        : "",
    });

    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) {
      return;
    }

    setIsModalOpen(false);
    setEditingTodo(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      if (editingTodo) {
        const payload: UpdateTodoRequest = {
          title: form.title.trim(),
          description: form.description.trim(),
          status: form.status,
          priority: form.priority,
          due_date: form.due_date
            ? new Date(form.due_date).toISOString()
            : null,
        };

        const updatedTodo = await updateTodo(
          editingTodo.id,
          payload,
        );

        setTodos((current) =>
          current.map((todo) =>
            todo.id === updatedTodo.id
              ? updatedTodo
              : todo,
          ),
        );
      } else {
        const payload: CreateTodoRequest = {
          title: form.title.trim(),
          description: form.description.trim(),
          status: form.status,
          priority: form.priority,
          due_date: form.due_date
            ? new Date(form.due_date).toISOString()
            : null,
        };

        const newTodo = await createTodo(payload);

        setTodos((current) => [newTodo, ...current]);
      }

      closeModal();
    } catch {
      setError(
        editingTodo
          ? "Unable to update the todo."
          : "Unable to create the todo.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    const nextStatus: TodoStatus =
      todo.status === "completed"
        ? "pending"
        : "completed";

    try {
      setActionTodoId(todo.id);
      setError(null);

      const updatedTodo = await updateTodo(todo.id, {
        status: nextStatus,
      });

      setTodos((current) =>
        current.map((item) =>
          item.id === updatedTodo.id
            ? updatedTodo
            : item,
        ),
      );
    } catch {
      setError("Unable to update the todo.");
    } finally {
      setActionTodoId(null);
    }
  };

  const handleDelete = async (todo: Todo) => {
    const confirmed = window.confirm(
      `Delete "${todo.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionTodoId(todo.id);
      setError(null);

      await deleteTodo(todo.id);

      setTodos((current) =>
        current.filter((item) => item.id !== todo.id),
      );
    } catch {
      setError("Unable to delete the todo.");
    } finally {
      setActionTodoId(null);
    }
  };

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
    <>
      <div className="mx-auto w-full max-w-6xl p-6 lg:p-8">
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
            onClick={openCreateModal}
            className="rounded-md bg-[#611f69] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4a154b] focus:outline-none focus:ring-2 focus:ring-[#611f69] focus:ring-offset-2 dark:focus:ring-offset-[#1a1d21]"
          >
            + Add Todo
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Total" value={todos.length} />
          <Stat label="Pending" value={pending} />
          <Stat label="In Progress" value={inProgress} />
          <Stat label="Completed" value={completed} />
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}

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

          {!isLoading && todos.length === 0 && (
            <div className="rounded-lg border border-dashed border-[#ccc] bg-white p-12 text-center dark:border-white/10 dark:bg-[#222529]">
              <div className="text-3xl">✓</div>

              <h3 className="mt-3 font-semibold text-[#1d1c1d] dark:text-white">
                No todos yet
              </h3>

              <p className="mt-1 text-sm text-[#616061] dark:text-[#9b9b9b]">
                Create your first todo to get started.
              </p>

              <button
                type="button"
                onClick={openCreateModal}
                className="mt-5 rounded-md bg-[#611f69] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4a154b]"
              >
                Create Todo
              </button>
            </div>
          )}

          {!isLoading && todos.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-[#ddd] bg-white dark:border-white/10 dark:bg-[#222529]">
              {todos.map((todo) => (
                <TodoRow
                  key={todo.id}
                  todo={todo}
                  isActing={actionTodoId === todo.id}
                  onToggleComplete={handleToggleComplete}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {isModalOpen && (
        <TodoModal
          editingTodo={editingTodo}
          form={form}
          setForm={setForm}
          isSaving={isSaving}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </>
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

function TodoRow({
  todo,
  isActing,
  onToggleComplete,
  onEdit,
  onDelete,
}: {
  todo: Todo;
  isActing: boolean;
  onToggleComplete: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}) {
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
          disabled={isActing}
          onClick={() => void onToggleComplete(todo)}
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#aaa] text-xs transition hover:border-[#611f69] hover:bg-[#611f69] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#777]"
          aria-label={
            todo.status === "completed"
              ? `Mark ${todo.title} as pending`
              : `Mark ${todo.title} as completed`
          }
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

        <div className="relative flex shrink-0 gap-1">
          <button
            type="button"
            disabled={isActing}
            onClick={() => onEdit(todo)}
            className="rounded px-2 py-1 text-sm text-[#616061] hover:bg-[#ddd] disabled:opacity-50 dark:text-[#aaa] dark:hover:bg-white/10"
            aria-label={`Edit ${todo.title}`}
          >
            Edit
          </button>

          <button
            type="button"
            disabled={isActing}
            onClick={() => void onDelete(todo)}
            className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-500/10"
            aria-label={`Delete ${todo.title}`}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function TodoModal({
  editingTodo,
  form,
  setForm,
  isSaving,
  onClose,
  onSubmit,
}: {
  editingTodo: Todo | null;
  form: TodoFormState;
  setForm: React.Dispatch<React.SetStateAction<TodoFormState>>;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border border-[#ddd] bg-white shadow-xl dark:border-white/10 dark:bg-[#222529]">
        <div className="flex items-center justify-between border-b border-[#eee] px-6 py-4 dark:border-white/10">
          <h2 className="text-lg font-semibold text-[#1d1c1d] dark:text-white">
            {editingTodo ? "Edit Todo" : "Create Todo"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded p-1 text-xl text-[#616061] hover:bg-[#eee] disabled:opacity-50 dark:text-[#aaa] dark:hover:bg-white/10"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 p-6">
          <div>
            <label
              htmlFor="todo-title"
              className="mb-1.5 block text-sm font-medium text-[#1d1c1d] dark:text-white"
            >
              Title
            </label>

            <input
              id="todo-title"
              type="text"
              required
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="What needs to be done?"
              className="w-full rounded-md border border-[#ccc] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#611f69] focus:ring-1 focus:ring-[#611f69] dark:border-white/10 dark:bg-[#1a1d21] dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="todo-description"
              className="mb-1.5 block text-sm font-medium text-[#1d1c1d] dark:text-white"
            >
              Description
            </label>

            <textarea
              id="todo-description"
              rows={3}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Add some details..."
              className="w-full resize-none rounded-md border border-[#ccc] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#611f69] focus:ring-1 focus:ring-[#611f69] dark:border-white/10 dark:bg-[#1a1d21] dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="todo-status"
                className="mb-1.5 block text-sm font-medium text-[#1d1c1d] dark:text-white"
              >
                Status
              </label>

              <select
                id="todo-status"
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as TodoStatus,
                  }))
                }
                className="w-full rounded-md border border-[#ccc] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#611f69] dark:border-white/10 dark:bg-[#1a1d21] dark:text-white"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="todo-priority"
                className="mb-1.5 block text-sm font-medium text-[#1d1c1d] dark:text-white"
              >
                Priority
              </label>

              <select
                id="todo-priority"
                value={form.priority}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    priority: Number(
                      event.target.value,
                    ) as TodoPriority,
                  }))
                }
                className="w-full rounded-md border border-[#ccc] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#611f69] dark:border-white/10 dark:bg-[#1a1d21] dark:text-white"
              >
                <option value={1}>Low</option>
                <option value={2}>Medium</option>
                <option value={3}>High</option>
                <option value={4}>Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="todo-due-date"
              className="mb-1.5 block text-sm font-medium text-[#1d1c1d] dark:text-white"
            >
              Due date
            </label>

            <input
              id="todo-due-date"
              type="datetime-local"
              value={form.due_date}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  due_date: event.target.value,
                }))
              }
              className="w-full rounded-md border border-[#ccc] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#611f69] focus:ring-1 focus:ring-[#611f69] dark:border-white/10 dark:bg-[#1a1d21] dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-[#eee] pt-5 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-md px-4 py-2 text-sm font-medium text-[#616061] hover:bg-[#eee] disabled:opacity-50 dark:text-[#ccc] dark:hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving || !form.title.trim()}
              className="rounded-md bg-[#611f69] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4a154b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving
                ? "Saving..."
                : editingTodo
                  ? "Save Changes"
                  : "Create Todo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-[#f1f1f1] px-2 py-1 text-xs text-[#616061] dark:bg-white/10 dark:text-[#bdbdbd]">
      {children}
    </span>
  );
}
