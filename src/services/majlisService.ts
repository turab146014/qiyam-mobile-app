import { ID } from "react-native-appwrite";
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
      dateValue: row.dateValue ?? "",
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

export type CreateMajlisData = {
  name: string;
  category: string;
  time: string;
  date: string;
  location: string;
  description: string;
  latitude: number;
  longitude: number;
  timeOrder: number;
  posterFileId: string;
  dateValue: string;
};

export const createMajlis = async (data: CreateMajlisData) => {
  try {
    const response = await tablesDB.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.majlisTableId,
      rowId: ID.unique(),
      data,
    });

    console.log("Majlis created:", response);

    return response;
  } catch (error) {
    console.log("Error creating Majlis:", error);
    throw error;
  }
};
