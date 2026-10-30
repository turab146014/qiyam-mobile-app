import { api } from "./apiClient";
import { tokenStorage } from "./tokenStorage";

export type AccountUser = {
  id: number;
  email: string;
  username: string;
  full_name?: string | null;
  phone?: string | null;
  is_email_verified: boolean;
  date_joined: string;
};

export type AccountChanges = {
  username?: string;
  full_name?: string;
  phone?: string;
};

type TokensResponse = {
  access: string;
  refresh: string;
  user: AccountUser;
};

export const getAccount = () => api.get<AccountUser>("/api/me");

export const updateAccount = (changes: AccountChanges) =>
  api.patch<AccountUser>("/api/me", changes);

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  const result = await api.post<TokensResponse>("/api/me/change-password", {
    current_password: currentPassword,
    new_password: newPassword,
  });

  await tokenStorage.save(result.access, result.refresh);

  return result.user;
};

export const deleteAccount = async (password: string) => {
  await api.post<void>("/api/me/delete", { password });
  await tokenStorage.clear();
};