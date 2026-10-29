import { ExecutionMethod } from "react-native-appwrite";
import { functions, appwriteConfig } from "../appwrite";

export const verifyForgotPasswordOtp = async (
  email: string,
  enteredOtp: string,
) => {
  const execution = await functions.createExecution({
    functionId: appwriteConfig.verifyForgotPasswordFunctionId,
    body: JSON.stringify({
      email: email.trim(),
      otp: enteredOtp,
    }),
    async: false,
    method: ExecutionMethod.POST,
  });
  
  let result: {success?: boolean; message?: string};

  try{
    result = JSON.parse(execution.responseBody);
  }catch {
    throw new Error("Unable to verify OTP right now. Please try again.")
  }
   

  if (!result.success) {
    throw new Error(result.message  || "Invalid or expired OTP.");
  }

  return true;
};


