import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
  updateProfile as updateProfileApi,
  type UpdateProfileRequest,
} from "../api/auth.api";

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "../api/client";

import type {
  LoginRequest,
  RegisterRequest,
  User,
} from "../types/auth";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  updateProfile: (
    data: UpdateProfileRequest,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null;

  const loadCurrentUser = useCallback(async () => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCurrentUser();
  }, [loadCurrentUser]);

  const login = useCallback(
    async (data: LoginRequest) => {
      const tokens = await loginApi(data);

      saveTokens(
        tokens.access,
        tokens.refresh,
      );

      const currentUser = await getCurrentUser();

      setUser(currentUser);
    },
    [],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      await registerApi(data);

      await login({
        username: data.username,
        password: data.password,
      });
    },
    [login],
  );


  const updateProfile = useCallback(
    async (data: UpdateProfileRequest) => {
      const updatedUser = await updateProfileApi(data);
      setUser(updatedUser);
    },
    [],
  );

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();

    try {
      if (refreshToken) {
        await logoutApi({
          refresh: refreshToken,
        });
      }
    } finally {
      clearTokens();
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      updateProfile,
      logout,
    }),
    [
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      updateProfile,
      logout,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider",
    );
  }

  return context;
}
