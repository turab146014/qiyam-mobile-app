import { Majlis } from "../types/majlis";

export const sortMajlisFilters = (
  majlisList: Majlis[],
  selectedFilter: string,
) => {
  if (selectedFilter == "Upcoming soonest first") {
    return [...majlisList].sort((a, b) => a.timeOrder - b.timeOrder);
  }

  if (selectedFilter == "Oldest first") {
    return [...majlisList].sort((a, b) => b.timeOrder - a.timeOrder);
  }

  if (selectedFilter == "Nearest distance first") {
    return [...majlisList].sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return majlisList;
};
