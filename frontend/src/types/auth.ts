export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  username_change_available_at: string | null;
  email_change_available_at: string | null;
  password_change_available_at: string | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface LogoutRequest {
  refresh: string;
}
