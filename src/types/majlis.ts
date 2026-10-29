export type Majlis = {
  id: number;
  rowId?: string;
  name: string;
  category: string;
  time: string;
  date: string;
  dateValue: string;
  location: string;
  distance: string;
  distanceKm: number;
  timeOrder: number;
  latitude: number;
  longitude: number;
  posterFileId: string;
  categoryLabel?: string;
  posterUrl?: string | null;
  status?: MajlisStatus;
  statusLabel?: string;
  rejectionReason?: string;
};

export type MajlisStatus = "pending" | "approved" | "rejected";

export type MyMajlisApi = {
  id: number;
  title: string;
  category: string;
  category_label: string;
  description?: string;
  address: string;
  latitude: number | string;
  longitude: number | string;
  starts_at: string;
  poster_url: string | null;
  organizer: string;
  status: MajlisStatus;
  status_label: string;
  rejection_reason: string;
  created_at: string;
  updated_at: string;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type PublicMajlisApi = {
  id: number;
  title: string;
  category: string;
  category_label: string;
  description?: string;
  address: string;
  latitude: number | string;
  longitude: number | string;
  starts_at: string;
  poster_url: string | null;
  organizer?: string;
  distance_km?: number | string | null;
};
