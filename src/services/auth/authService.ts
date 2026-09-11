import { ID } from "react-native-appwrite";
import { account } from "../appwrite";

type CreateAccountParams = {
  email: string;
  password: string;
  username: string;
};

export const createAccount = async ({
  email,
  password,
  username,
}: CreateAccountParams) => {
  return await account.create({
    userId: ID.unique(),
    email: email.trim(),
    password,
    name: username.trim(),
  });
};

export const loginAccount = async (email: string, password: string) => {
  return await account.createEmailPasswordSession({
    email: email.trim(),
    password,
  });
};

export const getCurrentUser = async () => {
  return await account.get();
};

export const logoutAccount = async () => {
  return await account.deleteSession({
    sessionId: "current",
  });
};

export const checkSession = async () => {
  try {
    const user = await getCurrentUser();

    return user;
  } catch {
    return null;
  }
};
