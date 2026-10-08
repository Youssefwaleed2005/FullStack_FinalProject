import { useEffect, useState } from "react";
import { getCategories } from "@/services/categoryService";
import type { Category } from "@/types/Category";

// Loads the categories once. If it fails the catalog still works, just without category chips.
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  return categories;
}
