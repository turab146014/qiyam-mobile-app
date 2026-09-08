export type PasswordStrength = "Weak" | "Medium" | "Strong";

export const getPasswordStrength = (password: string): PasswordStrength => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 2) return "Weak";
  if (strength <= 4) return "Medium";

  return "Strong";
};
