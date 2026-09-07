import { NavLink, Outlet, useSearchParams } from "react-router-dom";
import { useTheme } from "../auth/ThemeContext";


export function AppShell() {
  const { resolvedTheme, setTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const toggleTheme = () => {
    setTheme(
      resolvedTheme === "dark"
        ? "light"
        : "dark",
    );
  };

  return (
    <div
      className={
        "min-h-screen bg-white text-[#1d1c1d] dark:bg-[#1a1d21] dark:text-[#d1d2d3]"
      }
    >
      <div className="flex min-h-screen">
        {/* Workspace rail */}
        <aside className="flex w-16 flex-col items-center bg-[#3f0e40] py-4 text-white">
          <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg font-bold">
            T
          </div>

          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-lg hover:bg-white/10"
            title="Toggle theme"
          >
            {resolvedTheme === "dark" ? "☀" : "☾"}
          </button>
        </aside>

        {/* Navigation sidebar */}
        <aside className="hidden w-64 border-r border-white/10 bg-[#19171d] md:flex md:flex-col">
          <div className="flex h-16 items-center border-b border-white/10 px-5">
            <div>
              <h1 className="font-semibold text-white">
                Todo Platform
              </h1>
              <p className="text-xs text-gray-400">
                Workspace
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm transition ${isActive
                  ? "bg-[#1164a3] text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              🏠 Dashboard
            </NavLink>

            <div className="px-3 pb-1 pt-5 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Todos
            </div>

            <NavLink
              to="/dashboard"
              className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
            >
              # All Todos
            </NavLink>

            <NavLink
              to="/dashboard?status=pending"
              className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
            >
              # Pending
            </NavLink>

            <NavLink
              to="/dashboard?status=in_progress"
              className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
            >
              # In Progress
            </NavLink>

            <NavLink
              to="/dashboard?status=completed"
              className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
            >
              # Completed
            </NavLink>
          </nav>

          <div className="border-t border-white/10 p-3">
            <NavLink
              to="/login"
              className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
            >
              ↪ Logout
            </NavLink>
          </div>
        </aside>

        {/* Main workspace */}
        <main className="flex min-w-0 flex-1 flex-col bg-[#1a1d21]">
          {/* Top bar */}
          <header className="flex h-16 items-center gap-4 border-b border-white/10 px-4">
            <div className="flex max-w-xl flex-1 items-center rounded-md bg-white/10 px-3">
              <span className="mr-2 text-gray-400">⌕</span>

              <input
                type="text"
                placeholder="Search todos..."
                value={search}
                onChange={(event) => {
                  const value = event.target.value;

                  if (value) {
                    searchParams.set("search", value);
                  } else {
                    searchParams.delete("search");
                  }

                  setSearchParams(searchParams);
                }}
                className="w-full bg-transparent py-2 text-sm text-white outline-none placeholder:text-gray-500"
              />
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-sm text-gray-300">
                testuser
              </span>

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#611f69] text-sm font-semibold text-white">
                T
              </div>
            </div>
          </header>

          {/* Page */}
          <section className="min-h-0 flex-1 overflow-auto">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}
