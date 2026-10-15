import { ID } from "react-native-appwrite";
import { account } from "../appwrite";

type CreateAccountParams = {
  email: string;
  password: string;
  username: string;
  phone: string;
  cnic: string;
};

export const createAccount = async ({
  email,
  password,
  username,
  phone,
  cnic,
}: CreateAccountParams) => {
  const trimmedEmail = email.trim();

  const user = await account.create({
    userId: ID.unique(),
    email: trimmedEmail,
    password,
    name: username.trim(),
  });

  await account.createEmailPasswordSession({
    email: trimmedEmail,
    password,
  });

  await account.updatePrefs({
    prefs: {
      phone: phone.trim(),
      cnic: cnic.trim(),
    },
  });

  await account.deleteSession({
    sessionId: "current",
  });

  return user;
};

export const loginAccount = async (email: string, password: string) => {
  return account.createEmailPasswordSession({
    email: email.trim(),
    password,
  });
};

export const getCurrentUser = async () => {
  return account.get();
};

export const logoutAccount = async () => {
  return account.deleteSession({
    sessionId: "current",
  });
};

export const checkSession = async () => {
  try {
    return await getCurrentUser();
  } catch {
    return null;
  }
};
