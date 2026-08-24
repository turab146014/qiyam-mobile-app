import type { Majlis } from "../types/majlis";

export const sortMajlisFilters = (
  majlisList: Majlis[],
  selectedFilter: string,
) => {
  if (selectedFilter == "Soonest") {
    return [...majlisList].sort((a, b) => a.timeOrder - b.timeOrder);
  }

  if (selectedFilter == "Oldest") {
    return [...majlisList].sort((a, b) => b.timeOrder - a.timeOrder);
  }

  if (selectedFilter == "Nearest") {
    return [...majlisList].sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return majlisList;
};
