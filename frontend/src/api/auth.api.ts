import { api } from "./client";
import type {
  LoginRequest,
  LogoutRequest,
  RegisterRequest,
  TokenResponse,
  User,
} from "../types/auth";

export const register = async (
  data: RegisterRequest,
): Promise<User> => {
  const response = await api.post<User>("/auth/register/", data);
  return response.data;
};

export const login = async (
  data: LoginRequest,
): Promise<TokenResponse> => {
  const response = await api.post<TokenResponse>("/auth/login/", data);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>("/auth/me/");
  return response.data;
};

export const refreshToken = async (
  refresh: string,
): Promise<TokenResponse> => {
  const response = await api.post<TokenResponse>(
    "/auth/token/refresh/",
    { refresh },
  );

  return response.data;
};

export const logout = async (
  data: LogoutRequest,
): Promise<void> => {
  await api.post("/auth/logout/", data);
};
