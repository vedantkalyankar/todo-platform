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

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  password?: string;
}

export const updateProfile = async (
  data: UpdateProfileRequest,
): Promise<User> => {
  const response = await api.patch<User>(
    "/auth/profile/",
    data,
  );

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

export const uploadAvatar = async (
  file: File,
): Promise<User> => {
  const formData = new FormData();

  formData.append("avatar", file);

  const response = await api.post<User>(
    "/auth/profile/avatar/",
    formData,
  );

  return response.data;
};

export const setDefaultAvatar = async (
  avatarKey: string,
): Promise<User> => {
  const response = await api.post<User>(
    "/auth/profile/avatar/",
    {
      avatar_type: "default",
      avatar_key: avatarKey,
    },
  );

  return response.data;
};

export const removeAvatar = async (): Promise<User> => {
  const response = await api.delete<User>(
    "/auth/profile/avatar/",
  );

  return response.data;
};