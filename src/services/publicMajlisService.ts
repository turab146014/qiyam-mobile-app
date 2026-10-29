import { api } from "./apiClient";
import type { Majlis, Paginated, PublicMajlisApi } from "../types/majlis";
import { formatEventDate, formatEventTime } from "../utils/eventForm";

export type MajlisOrdering = "soonest" | "latest" | "nearest";

export type MajlisSearch = {
  lat?: number;
  lng?: number;
  radiusKm?: number;
  category?: string;
  ordering?: MajlisOrdering;
  pageSize?: number;
};

const toAppPublicMajlis = (item: PublicMajlisApi): Majlis => {
  const startsAt = new Date(item.starts_at);
  const distanceKm =
    item.distance_km === undefined || item.distance_km === null
      ? null
      : Number(item.distance_km);

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
    distanceKm: distanceKm ?? 0,
    distance: distanceKm === null ? "" : `${distanceKm.toFixed(1)} km`,
    posterFileId: "",
    posterUrl: item.poster_url,
  };
};

export const searchMajalis = async (search: MajlisSearch) => {
  const page = await api.get<Paginated<PublicMajlisApi>>(
    "/api/majalis",
    {
      lat: search.lat,
      lng: search.lng,
      radius_km: search.radiusKm,
      category: search.category,
      ordering: search.ordering,
      page_size: search.pageSize,
    },
    false,
  );

  return {
    items: page.results.map(toAppPublicMajlis),
    next: page.next,
    count: page.count,
  };
};

export const getPublicMajlisById = async (id: string) => {
  const item = await api.get<PublicMajlisApi>(
    `/api/majalis/${id}`,
    undefined,
    false,
  );

  return toAppPublicMajlis(item);
};

export const loadMoreMajalis = async (nextUrl: string) => {
  const page = await api.get<Paginated<PublicMajlisApi>>(
    nextUrl.replace(/^http:\/\//, "https://"),
    undefined,
    false,
  );

  return {
    items: page.results.map(toAppPublicMajlis),
    next: page.next,
    count: page.count,
  };
};
