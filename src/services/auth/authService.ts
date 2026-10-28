import { api } from "../apiClient";
import { tokenStorage } from "../tokenStorage";

export type User = {
  id?: number | string;
  username: string;
  email: string;
  full_name?: string;
  phone?: string | null;
};

type AuthResponse = {
  access: string;
  refresh: string;
  user: User;
};

type CreateAccountParams = {
  email: string;
  password: string;
  username: string;
  phone?: string;
};

export const createAccount = async ({
  email,
  password,
  username,
  phone,
}: CreateAccountParams) => {
  const body: Record<string, unknown> = {
    email: email.trim(),
    username: username.trim(),
    password,
  };

  const trimmedPhone = phone?.trim();

  if (trimmedPhone) {
    body.phone = trimmedPhone;
  }

  await api.post("/api/auth/register", body, false);
};

export const verifyEmail = async (email: string, code: string) => {
  const data = await api.post<AuthResponse>(
    "/api/auth/verify-email",
    { email: email.trim(), code: code.trim() },
    false,
  );

  await tokenStorage.save(data.access, data.refresh);

  return data.user;
};

export const resendVerification = async (email: string) => {
  await api.post(
    "/api/auth/resend-verification",
    { email: email.trim() },
    false,
  );
};

export const loginAccount = async (identifier: string, password: string) => {
  const data = await api.post<AuthResponse>(
    "/api/auth/login",
    { identifier: identifier.trim(), password },
    false,
  );

  await tokenStorage.save(data.access, data.refresh);

  return data.user;
};

export const getCurrentUser = () => api.get<User>("/api/me");

export const logoutAccount = async () => {
  const refresh = await tokenStorage.getRefresh();

  try {
    if (refresh) {
      await api.post("/api/auth/logout", { refresh }, false);
    }
  } catch {
  } finally {
    await tokenStorage.clear();
  }
};

export const checkSession = async () => {
  const refresh = await tokenStorage.getRefresh();

  if (!refresh) return null;

  try {
    return await getCurrentUser();
  } catch {
    return null;
  }
};