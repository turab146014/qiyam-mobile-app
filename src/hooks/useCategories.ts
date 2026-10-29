import { useCallback, useEffect, useState } from "react";

import { ApiError } from "../services/apiClient";
import { getCategories, type Category } from "../services/categoryService";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isActive = true;

    const loadCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError("");

      try {
        const list = await getCategories();

        if (isActive) {
          setCategories(list);
        }
      } catch (error) {
        if (isActive) {
          console.error("Unable to load categories:", error);
          setCategoriesError(
            error instanceof ApiError
              ? error.message
              : "Couldn't load categories. Please try again.",
          );
        }
      } finally {
        if (isActive) {
          setCategoriesLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isActive = false;
    };
  }, [reloadKey]);

  const reloadCategories = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  const getCategoryLabel = useCallback(
    (value: string) =>
      categories.find((category) => category.value === value)?.label ?? value,
    [categories],
  );

  return {
    categories,
    categoriesLoading,
    categoriesError,
    reloadCategories,
    getCategoryLabel,
  };
};