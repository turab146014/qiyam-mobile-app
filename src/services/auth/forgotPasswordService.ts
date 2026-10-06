import { ExecutionMethod } from "react-native-appwrite";

import { functions, appwriteConfig } from "../appwrite";

export const sendForgotPasswordOtp = async (email: string) => {
  return await functions.createExecution({
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
};


export const resetPassword = async (
  email: string,
  newPassword: string,
) => {
  const execution = await functions.createExecution({
    functionId: appwriteConfig.verifyForgotPasswordFunctionId,
    body: JSON.stringify({
      action: "reset-password",
      email: email.trim(),
      newPassword,
    }),
    async: false,
    method: ExecutionMethod.POST,
  });

  const result = JSON.parse(execution.responseBody);

  if (!result.success) {
    throw new Error(result.message);
  }

  return true;
};
