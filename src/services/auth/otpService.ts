import { ID, Query, ExecutionMethod } from "react-native-appwrite";

import { tablesDB, functions, appwriteConfig } from "../appwrite";

import { generateOtp } from "../../utils/auth/generateOtp";

type CreateOtpParams = {
  userId: string;
  email: string;
  otp: string;
  purpose : string;
};

export const createOtpRecord = async ({
  userId,
  email,
  otp,
  purpose,
}: CreateOtpParams) => {
  return await tablesDB.createRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.otpTableId,
    rowId: ID.unique(),
    data: {
      userId,
      email,
      otp,
      isVerified: false,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      purpose,
    },
  });
};

export const verifyOtp = async (email: string, enteredOtp: string) => {
  const response = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.otpTableId,
    queries: [Query.equal("email", email.trim())],
  });
  if (response.rows.length === 0) {
    throw new Error("OTP record not found");
  }

  const otpRecord = response.rows[0];

  const isExpired = new Date(otpRecord.expiresAt) < new Date();

  if (isExpired) {
    throw new Error("OTP expired");
  }

  if (otpRecord.otp !== enteredOtp) {
    throw new Error("Invalid OTP");
  }

  await tablesDB.updateRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.otpTableId,
    rowId: otpRecord.$id,
    data: {
      isVerified: true,
    },
  });

  return true;
};

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

  const result = JSON.parse(execution.responseBody);

  if (!result.success) {
    throw new Error(result.message);
  }

  return true;
};

export const resendOtp = async (email: string) => {
  const response = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.otpTableId,
    queries: [Query.equal("email", email.trim())],
  });

  if (response.rows.length === 0) {
    throw new Error("OTP record not found");
  }

  const otpRecord = response.rows[0];

  const newOtp = generateOtp();

  await tablesDB.updateRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.otpTableId,
    rowId: otpRecord.$id,
    data: {
      otp: newOtp,
      isVerified: false,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    },
  });

  return newOtp;
};
