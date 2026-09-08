import {
  NavLink,
  Outlet,
  useSearchParams,
} from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../auth/ThemeContext";
import { useAuth } from "../auth/AuthContext";


export function AppShell() {
  const {
    user,
    updateProfile,
    setDefaultAvatar,
    uploadAvatar,
  } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const defaultAvatars = [
    "/avatars/bamboo-stick-svgrepo-com.svg",
    "/avatars/branches-with-leaves-svgrepo-com.svg",
    "/avatars/butter-knife-svgrepo-com.svg",
    "/avatars/chinese-paper-writing-svgrepo-com.svg",
    "/avatars/dish-and-toothpick-svgrepo-com.svg",
    "/avatars/fertilizer-svgrepo-com.svg",
    "/avatars/gong-svgrepo-com.svg",
    "/avatars/japan-food-svgrepo-com.svg",
    "/avatars/japanese-bird-svgrepo-com.svg",
    "/avatars/japanese-character-svgrepo-com.svg",
    "/avatars/japanese-circular-symbol-svgrepo-com.svg",
    "/avatars/japanese-flower-svgrepo-com.svg",
    "/avatars/japanese-hand-fan-svgrepo-com.svg",
    "/avatars/japanese-ornament-svgrepo-com.svg",
    "/avatars/japanese-pagoda-svgrepo-com.svg",
    "/avatars/japanese-tea-pot-svgrepo-com.svg",
    "/avatars/japanese-yen-paper-bill-svgrepo-com.svg",
    "/avatars/kamon-japanese-svgrepo-com.svg",
    "/avatars/kanagawa-japan-kanji-svgrepo-com.svg",
    "/avatars/miyagi-prefecture-svgrepo-com.svg",
    "/avatars/n-logo-svgrepo-com.svg",
    "/avatars/origami-swan-svgrepo-com.svg",
    "/avatars/ornament-japan-flowers-svgrepo-com.svg",
    "/avatars/radish-svgrepo-com.svg",
    "/avatars/speed-limit-100-svgrepo-com.svg",
    "/avatars/tottori-japanese-flag-symbol-svgrepo-com.svg",
  ];
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

  const avatarInitial = user?.username?.trim().charAt(0).toUpperCase() || "U";
  const handleAvatarSave = async () => {
    try {
      if (avatarFile) {
        await uploadAvatar(avatarFile);
      } else if (selectedAvatar) {
        const avatarKey = selectedAvatar
          .split("/")
          .pop()
          ?.replace(".svg", "");

        if (!avatarKey) {
          return;
        }

        await setDefaultAvatar(avatarKey);
      }

      setAvatarFile(null);
      setAvatarPreview(null);
      setSelectedAvatar(null);
      setIsAvatarOpen(false);
    } catch (error) {
      console.error("Failed to save avatar:", error);
    }
  };
  const currentAvatarPath =
  user?.avatar_type === "default" && user?.avatar_key
    ? `/avatars/${user.avatar_key}.svg`
    : null;
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

              <button
                type="button"
                onClick={() => setIsAvatarOpen(true)}
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#611f69] text-sm font-semibold text-white"
                aria-label="Open avatar settings"
              >
                {user?.avatar_type === "default" && user?.avatar_key ? (
                  <img
                    src={`/avatars/${user.avatar_key}.svg`}
                    alt="User avatar"
                    className="h-full w-full object-cover"
                  />
                ) : user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  avatarInitial
                )}
              </button>
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
      {isAvatarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#19171d] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Avatar Settings
              </h2>

              <button
                type="button"
                onClick={() => setIsAvatarOpen(false)}
                className="text-xl text-gray-400 hover:text-white"
                aria-label="Close avatar settings"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#611f69] text-3xl font-semibold text-white">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : selectedAvatar ? (
                  <img
                    src={selectedAvatar}
                    alt="Selected avatar"
                    className="h-full w-full object-cover"
                  />
                ) : user?.avatar_type === "default" && user?.avatar_key ? (
                  <img
                    src={`/avatars/${user.avatar_key}.svg`}
                    alt="Current avatar"
                    className="h-full w-full object-cover"
                  />
                ) : user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Current avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  avatarInitial
                )}
              </div>

              <p className="text-sm text-gray-400">
                Choose your avatar
              </p>
              <div className="mt-4 w-full">
                <p className="mb-3 text-sm font-medium text-white">
                  Built-in avatars
                </p>

                <div className="grid grid-cols-5 gap-3">
                  {defaultAvatars.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(avatar);
                        setAvatarFile(null);
                        setAvatarPreview(null);
                      }}
                      className={`overflow-hidden rounded-full border-2 ${(selectedAvatar ?? currentAvatarPath) === avatar
                        ? "border-white"
                        : "border-transparent"
                        }`}
                      aria-label={`Select ${avatar}`}
                    >
                      <img
                        src={avatar}
                        alt=""
                        className="aspect-square w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;

                  setAvatarFile(file);
                  setSelectedAvatar(null);
                  if (!file) {
                    setAvatarPreview(null);
                    return;
                  }

                  const reader = new FileReader();

                  reader.onload = () => {
                    if (typeof reader.result === "string") {
                      setAvatarPreview(reader.result);
                    }
                  };

                  reader.readAsDataURL(file);
                }}
                className="mt-4 w-full text-sm text-gray-300"
              />

            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAvatarOpen(false)}
                className="rounded-md bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleAvatarSave}
                disabled={!avatarFile && !selectedAvatar}
                className="rounded-md bg-[#611f69] px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}