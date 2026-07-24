import "react-native-url-polyfill/auto";
import { Client, TablesDB } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://syd.cloud.appwrite.io/v1",
  projectId: "6a61f72e003c3258ed6a",
  platform: "com.fourteenlabs.qiyamapp",
  databaseId: "6a61f9b40035dfd0f2da",
  majlisTableId: "majlis",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const tablesDB = new TablesDB(client);
