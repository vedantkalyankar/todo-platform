import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/dashboard";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await login({
        username: username.trim(),
        password,
      });

      navigate(from, { replace: true });
    } catch {
      setError("Invalid username or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f8f8] px-4 dark:bg-[#1a1d21]">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#611f69] text-xl font-bold text-white">
            T
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[#1d1c1d] dark:text-white">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-[#616061] dark:text-[#9b9b9b]">
            Sign in to your Todo Platform workspace.
          </p>
        </div>

        <div className="rounded-xl border border-[#ddd] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#222529]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                role="alert"
                className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-[#1d1c1d] dark:text-white"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your username"
                className="w-full rounded-md border border-[#bbb] bg-white px-3 py-2.5 text-sm text-[#1d1c1d] outline-none transition placeholder:text-[#888] focus:border-[#611f69] focus:ring-2 focus:ring-[#611f69]/20 dark:border-white/15 dark:bg-[#1a1d21] dark:text-white dark:placeholder:text-[#777]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#1d1c1d] dark:text-white"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-md border border-[#bbb] bg-white px-3 py-2.5 text-sm text-[#1d1c1d] outline-none transition placeholder:text-[#888] focus:border-[#611f69] focus:ring-2 focus:ring-[#611f69]/20 dark:border-white/15 dark:bg-[#1a1d21] dark:text-white dark:placeholder:text-[#777]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-[#611f69] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4a154b] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#611f69] focus:ring-offset-2 dark:focus:ring-offset-[#222529]"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 border-t border-[#eee] pt-5 text-center dark:border-white/10">
            <p className="text-sm text-[#616061] dark:text-[#9b9b9b]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#611f69] hover:underline dark:text-[#c084d4]"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}