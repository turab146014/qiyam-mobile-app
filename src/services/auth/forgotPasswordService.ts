import { ExecutionMethod } from "react-native-appwrite";
import { functions, appwriteConfig } from "../appwrite";

type FunctionResponse = {
  success?: boolean;
  message?: string;
};

export const sendForgotPasswordOtp = async (email: string) => {
  const execution = await functions.createExecution({
    functionId: appwriteConfig.forgotPasswordFunctionId,
    body: JSON.stringify({
      email: email.trim(),
    }),
    method: ExecutionMethod.POST,
    async: false,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (execution.responseStatusCode !== 200) {
    throw new Error("Forgot password function failed");
  }

  let result: FunctionResponse | null = null;

  try {
    result = JSON.parse(execution.responseBody);
  } catch {
    result = null;
  }

  if (result?.success === false) {
    throw new Error(result.message || "Unable to send OTP.");
  }
};

export const resetPassword = async (email: string, newPassword: string) => {
  const execution = await functions.createExecution({
    functionId: appwriteConfig.verifyForgotPasswordFunctionId,
    body: JSON.stringify({
      action: "reset-password",
      email: email.trim(),
      newPassword,
    }),
    method: ExecutionMethod.POST,
    async: false,
  });

  let result: FunctionResponse;

  try {
    result = JSON.parse(execution.responseBody);
  } catch {
    throw new Error("Unable to reset password right now. Please try again.");
  }

  if (!result.success) {
    throw new Error(
      result.message || "Unable to reset password. Please try again.",
    );
  }
};
