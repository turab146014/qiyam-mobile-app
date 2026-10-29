import { api } from "../apiClient";
import { tokenStorage } from "../tokenStorage";

type ResetTokenResponse = {
  reset_token: string;
};

export const requestPasswordReset = async (email: string) => {
  await api.post(
    "/api/auth/password-reset/request",
    { email: email.trim() },
    false,
  );
};

export const verifyPasswordResetCode = async (email: string, code: string) => {
  const data = await api.post<ResetTokenResponse>(
    "/api/auth/password-reset/verify",
    { email: email.trim(), code: code.trim() },
    false,
  );

  return data.reset_token;
};

export const confirmPasswordReset = async (
  email: string,
  resetToken: string,
  newPassword: string,
) => {
  await api.post(
    "/api/auth/password-reset/confirm",
    {
      email: email.trim(),
      reset_token: resetToken,
      new_password: newPassword,
    },
    false,
  );

  await tokenStorage.clear();
};
