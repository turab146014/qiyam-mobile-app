import { api } from "./apiClient";

export type Category = {
  value: string;
  label: string;
};

export const getCategories = () =>
  api.get<Category[]>("/api/majalis/categories", undefined, false);