import "react-native-url-polyfill/auto";
import { Client, Account, TablesDB, Functions } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://syd.cloud.appwrite.io/v1",
  projectId: "6a61f72e003c3258ed6a",
  platform: "com.fourteenlabs.qiyamapp",
  databaseId: "6a61f9b40035dfd0f2da",
  majlisTableId: "majlis",
  posterBucketId: "6a6b33ca00359e40be95",
  otpTableId: "6aa7eabd0027eba8f25b",
  forgotPasswordFunctionId: "6ab3c3400026f5d803fb",
  verifyForgotPasswordFunctionId: "6abcfa6600094517dd39",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const tablesDB = new TablesDB(client);
export const account = new Account(client);
export const functions = new Functions(client);
