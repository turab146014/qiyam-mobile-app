import { ID, Query } from "react-native-appwrite";

import { appwriteConfig, tablesDB } from "./appwrite";
import type { Majlis } from "../types/majlis";

export type CreateMajlisData = {
  userId: string;
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

type UpdateMajlisData = {
  name: string;
  category: string;
  location: string;
  date: string;
  time: string;
  dateValue: string;
  timeOrder: number;
  posterFileId: string;
  latitude: number;
  longitude: number;
};

export const createMajlis = async (data: CreateMajlisData) => {
  try {
    return await tablesDB.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.majlisTableId,
      rowId: ID.unique(),
      data,
    });
  } catch (error) {
    console.error("Error creating Majlis:", error);
    throw error;
  }
};

export const getMajlisRows = async (userId?: string): Promise<Majlis[]> => {
  try {
    const response = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.majlisTableId,
      queries: userId ? [Query.equal("userId", userId)] : [],
    });

    return response.rows.map((row) => ({
      id: Number(row.$sequence),
      rowId: row.$id,
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
    })) as Majlis[];
  } catch (error) {
    console.error("Error fetching Majlis rows:", error);
    throw error;
  }
};

export const getMajlisById = async (rowId: string) => {
  try {
    return await tablesDB.getRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.majlisTableId,
      rowId,
    });
  } catch (error) {
    console.error("Error fetching selected Majlis:", error);
    throw error;
  }
};

export const updateMajlis = async (
  rowId: string,
  updatedData: UpdateMajlisData,
) => {
  try {
    return await tablesDB.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.majlisTableId,
      rowId,
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating Majlis:", error);
    throw error;
  }
};

export const deleteMajlis = async (rowId: string) => {
  try {
    await tablesDB.deleteRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.majlisTableId,
      rowId,
    });
  } catch (error) {
    console.error("Error deleting Majlis:", error);
    throw error;
  }
};
