import { appwriteConfig, tablesDB } from "./appwrite";
import type { Majlis } from "../types/majlis";

export const getMajlisRows = async (): Promise<Majlis[]> => {
  try {
    const response = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.majlisTableId,
    });

    const majlisRows: Majlis[] = response.rows.map((row: any) => ({
      id: Number(row.$sequence),
      name: row.name,
      category: row.category,
      time: row.time,
      date: row.date,
      location: row.location,
      distance: "Calculating distance ...",
      distanceKm: 0,
      timeOrder: Number(row.timeOrder),
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      posterFileId: row.posterFileId ?? "",
    }));

    return majlisRows;
  } catch (error) {
    console.log("Error fetching Majlis rows:", error);
    throw error;
  }
};
