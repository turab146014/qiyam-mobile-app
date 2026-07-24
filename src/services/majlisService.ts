import { appwriteConfig, tablesDB } from "./appwrite";

export const getMajlisRows = async () => {
  try {
    const response = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.majlisTableId,
    });

    return response.rows;
  } catch (error) {
    console.log("Error fetching Majlis rows:", error);
    return [];
  }
};
