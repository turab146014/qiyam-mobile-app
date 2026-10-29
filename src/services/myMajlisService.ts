import { api } from "./apiClient";  
import type * as ImagePicker from "expo-image-picker";
import type { Majlis, MyMajlisApi, Paginated } from "../types/majlis";
import { formatEventDate, formatEventTime } from "../utils/eventForm";

export type MyMajlisTab = "upcoming" | "past" | "rejected";

export const toAppMajlis = (item: MyMajlisApi): Majlis => {
  const startsAt = new Date(item.starts_at);

  return {
    id: item.id,
    rowId: String(item.id),
    name: item.title,
    category: item.category,
    categoryLabel: item.category_label,
    location: item.address,
    latitude: Number(item.latitude),
    longitude: Number(item.longitude),
    dateValue: item.starts_at,
    date: formatEventDate(startsAt),
    time: formatEventTime(startsAt),
    timeOrder: startsAt.getTime(),
    distance: "",
    distanceKm: 0,
    posterFileId: "",
    posterUrl: item.poster_url,
    status: item.status,
    statusLabel: item.status_label,
    rejectionReason: item.rejection_reason,
  };
};

export const getMyMajalis = async (tab: MyMajlisTab): Promise<Majlis[]> => {
  const page = await api.get<Paginated<MyMajlisApi>>("/api/my/majalis", {
    tab,
  });

  return page.results.map(toAppMajlis);
};

export const deleteMyMajlis = async (id: string) => {
  await api.delete(`/api/my/majalis/${id}`);
};

export type MajlisFormInput = {
  title: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  startsAt: Date;
  description?: string;
};

const toApiFields = (input: Partial<MajlisFormInput>) => {
  const fields: Record<string, string> = {};

  if (input.title !== undefined) fields.title = input.title;
  if (input.category !== undefined) fields.category = input.category;
  if (input.address !== undefined) fields.address = input.address;
  if (input.latitude !== undefined) {
    fields.latitude = input.latitude.toFixed(6);
  }
  if (input.longitude !== undefined) {
    fields.longitude = input.longitude.toFixed(6);
  }
  if (input.startsAt !== undefined) {
    fields.starts_at = input.startsAt.toISOString();
  }
  if (input.description !== undefined) {
    fields.description = input.description;
  }

  return fields;
};

const toFormData = (
  fields: Record<string, string>,
  poster?: ImagePicker.ImagePickerAsset | null,
) => {
  const form = new FormData();

  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }

  if (poster) {
    form.append("poster", {
      uri: poster.uri,
      name: poster.fileName ?? `poster-${Date.now()}.jpg`,
      type: poster.mimeType ?? "image/jpeg",
    } as unknown as Blob);
  }

  return form;
};

export const createMyMajlis = async (
  input: MajlisFormInput,
  poster: ImagePicker.ImagePickerAsset,
) => {
  const item = await api.post<MyMajlisApi>(
    "/api/my/majalis",
    toFormData(toApiFields(input), poster),
  );

  return toAppMajlis(item);
};

export const getMyMajlisById = async (id: string) => {
  const item = await api.get<MyMajlisApi>(`/api/my/majalis/${id}`);

  return toAppMajlis(item);
};

export const updateMyMajlis = async (
  id: string,
  changes: Partial<MajlisFormInput>,
  poster?: ImagePicker.ImagePickerAsset | null,
) => {
  const fields = toApiFields(changes);
  const body = poster ? toFormData(fields, poster) : fields;

  const item = await api.patch<MyMajlisApi>(`/api/my/majalis/${id}`, body);

  return toAppMajlis(item);
};
