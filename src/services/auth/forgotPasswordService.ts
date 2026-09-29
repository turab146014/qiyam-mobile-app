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
