import { ID, Query } from "react-native-appwrite";

import { tablesDB, appwriteConfig } from "../appwrite";

import { generateOtp } from "../../utils/auth/generateOtp";

type CreateOtpParams = {
  userId: string;
  email: string;
  otp: string;
};

export const createOtpRecord = async ({
  userId,
  email,
  otp,
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
