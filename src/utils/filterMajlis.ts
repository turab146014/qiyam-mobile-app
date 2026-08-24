import type { Majlis } from "../types/majlis";

export const filterMajlisResults = (
  majlisList: Majlis[],
  selectedCategory: string,
  selectedDistance: number,
) => {
  let results = majlisList;

  if (selectedCategory !== "All") {
    results = results.filter((item) => item.category === selectedCategory);
  }

  results = results.filter((item) => item.distanceKm <= selectedDistance);
  return results;
};
