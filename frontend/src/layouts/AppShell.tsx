import {
  NavLink,
  Outlet,
  useSearchParams,
} from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../auth/ThemeContext";
import { useAuth } from "../auth/AuthContext";


export function AppShell() {
  const { user, updateProfile } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [profileUsername, setProfileUsername] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [isProfileConfirmOpen, setIsProfileConfirmOpen] = useState(false);
  const [pendingProfileData, setPendingProfileData] = useState<{
    username?: string;
    email?: string;
    password?: string;
  } | null>(null);
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
            {/* Search */}
            <div className="flex max-w-xl flex-1 items-center rounded-md bg-white/10 px-3">
              <span className="mr-2 text-gray-400">
                ⌕
              </span>

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

            {/* User section */}
            <div className="hidden items-center gap-3 sm:flex">
              <button
                type="button"
                onClick={() => {
                  setProfileUsername(user?.username ?? "");
                  setProfileEmail(user?.email ?? "");
                  setProfilePassword("");
                  setIsProfileOpen(true);
                }}
                className="text-sm text-gray-300 hover:text-white"
              >
                {user?.username ?? "User"}
              </button>

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#611f69] text-sm font-semibold text-white">
                T
              </div>
            </div>
          </header>

          {/* Profile Settings popup */}
          {isProfileOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#19171d] p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">
                    Profile Settings
                  </h2>

                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(false)}
                    className="text-xl text-gray-400 hover:text-white"
                    aria-label="Close profile settings"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm text-gray-300">
                      Username
                    </label>

                    <input
                      type="text"
                      value={profileUsername}
                      onChange={(event) => setProfileUsername(event.target.value)}
                      className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      {user?.username_change_available_at
                        ? `Locked until ${new Date(
                          user.username_change_available_at,
                        ).toLocaleString()}`
                        : "Available to change"}
                    </p>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm text-gray-300">
                      Email
                    </label>

                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(event) => setProfileEmail(event.target.value)}
                      className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      {user?.email_change_available_at
                        ? `Locked until ${new Date(
                          user.email_change_available_at,
                        ).toLocaleString()}`
                        : "Available to change"}
                    </p>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm text-gray-300">
                      Password
                    </label>

                    <input
                      type="password"
                      value={profilePassword}
                      onChange={(event) => setProfilePassword(event.target.value)}
                      placeholder="Enter new password"
                      className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none placeholder:text-gray-500"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      {user?.password_change_available_at
                        ? `Locked until ${new Date(
                          user.password_change_available_at,
                        ).toLocaleString()}`
                        : "Available to change"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(false)}
                    className="rounded-md bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const data: {
                        username?: string;
                        email?: string;
                        password?: string;
                      } = {};

                      if (profileUsername !== user?.username) {
                        data.username = profileUsername;
                      }

                      if (profileEmail !== user?.email) {
                        data.email = profileEmail;
                      }

                      if (profilePassword) {
                        data.password = profilePassword;
                      }

                      if (Object.keys(data).length === 0) {
                        setIsProfileOpen(false);
                        return;
                      }

                      setPendingProfileData(data);
                      setIsProfileConfirmOpen(true);
                    }}
                    className="rounded-md bg-[#1164a3] px-4 py-2 text-sm font-medium text-white hover:bg-[#0f5a91]"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
          {isProfileConfirmOpen && pendingProfileData && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
              <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#19171d] p-6 shadow-2xl">
                <h2 className="mb-4 text-lg font-semibold text-white">
                  Important: 30-Day Change Restriction
                </h2>

                <p className="mb-4 text-sm leading-6 text-gray-300">
                  You are about to change your{" "}
                  {[
                    pendingProfileData.username && "username",
                    pendingProfileData.email && "email",
                    pendingProfileData.password && "password",
                  ]
                    .filter(Boolean)
                    .map((field, index, fields) => (
                      <span key={field}>
                        {index > 0 && (
                          index === fields.length - 1
                            ? " and "
                            : ", "
                        )}
                        {field}
                      </span>
                    ))}
                  .
                </p>

                <p className="mb-6 text-sm leading-6 text-gray-300">
                  After this change is saved, you will not be able
                  to change this information again for 30 days.
                </p>

                <p className="mb-6 text-sm font-medium text-white">
                  Do you want to continue?
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileConfirmOpen(false);
                      setPendingProfileData(null);
                    }}
                    className="rounded-md bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      if (!pendingProfileData) {
                        return;
                      }

                      await updateProfile(pendingProfileData);

                      setProfilePassword("");
                      setPendingProfileData(null);
                      setIsProfileConfirmOpen(false);
                      setIsProfileOpen(false);
                    }}
                    className="rounded-md bg-[#1164a3] px-4 py-2 text-sm font-medium text-white hover:bg-[#0f5a91]"
                  >
                    OK, Continue
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Page */}
          <section className="min-h-0 flex-1 overflow-auto">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}