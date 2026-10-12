import { useSearchParams } from "react-router-dom";

export type ProgramFilters = {
  search: string;
  categoryId: number | null;
  page: number;
};

// Names used in the URL, e.g. /programs?q=data&category=2&page=2
const PARAM_NAMES = {
  search: "q",
  categoryId: "category",
  page: "page",
} as const;

type FilterName = keyof typeof PARAM_NAMES;

function toPositiveInt(value: string | null): number | null {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

// Keeps the program filters in the URL, like useCourseFilters does for the course catalog
export function useProgramFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ProgramFilters = {
    search: searchParams.get(PARAM_NAMES.search) ?? "",
    categoryId: toPositiveInt(searchParams.get(PARAM_NAMES.categoryId)),
    page: toPositiveInt(searchParams.get(PARAM_NAMES.page)) ?? 1,
  };

  // Pass null to remove a filter. Changing any filter goes back to page 1.
  function setFilter(name: FilterName, value: string | number | null) {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        const isDefault =
          value === null || value === "" || (name === "page" && value === 1);

        if (isDefault) next.delete(PARAM_NAMES[name]);
        else next.set(PARAM_NAMES[name], String(value));

        if (name !== "page") next.delete(PARAM_NAMES.page);
        return next;
      },
      // Typing in the search box should not fill the browser history
      { replace: name === "search" },
    );
  }

  function clearFilters() {
    setSearchParams({});
  }

  const activeFilterCount = [filters.search, filters.categoryId].filter(
    Boolean,
  ).length;

  return { filters, setFilter, clearFilters, activeFilterCount };
}
