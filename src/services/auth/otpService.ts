import { ID } from "react-native-appwrite";
import { tablesDB, appwriteConfig } from "../appwrite";

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
