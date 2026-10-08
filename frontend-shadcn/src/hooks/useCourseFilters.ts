import { useSearchParams } from "react-router-dom";
import {
  COURSE_TYPES,
  DEFAULT_SORT,
  FILTERABLE_STATUSES,
  SORT_OPTIONS,
  type SortValue,
} from "@/lib/course";
import type { CourseStatus, CourseType } from "@/types/Course";

export type CourseFilters = {
  search: string;
  categoryId: number | null;
  type: CourseType | null;
  status: CourseStatus | null;
  sort: SortValue;
  page: number;
};

// Names used in the URL, e.g. /courses?q=react&category=2&page=3
const PARAM_NAMES = {
  search: "q",
  categoryId: "category",
  type: "type",
  status: "status",
  sort: "sort",
  page: "page",
} as const;

type FilterName = keyof typeof PARAM_NAMES;

function toPositiveInt(value: string | null): number | null {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

// Keeps the catalog filters in the URL instead of in component state,
// so they survive a refresh, work with the back button and can be shared as a link.
export function useCourseFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const type = searchParams.get(PARAM_NAMES.type) as CourseType | null;
  const status = searchParams.get(PARAM_NAMES.status) as CourseStatus | null;
  const sort = searchParams.get(PARAM_NAMES.sort) as SortValue | null;

  // Anything invalid typed into the URL falls back to the default
  const filters: CourseFilters = {
    search: searchParams.get(PARAM_NAMES.search) ?? "",
    categoryId: toPositiveInt(searchParams.get(PARAM_NAMES.categoryId)),
    type: type && COURSE_TYPES.includes(type) ? type : null,
    status: status && FILTERABLE_STATUSES.includes(status) ? status : null,
    sort:
      sort && SORT_OPTIONS.some((option) => option.value === sort)
        ? sort
        : DEFAULT_SORT,
    page: toPositiveInt(searchParams.get(PARAM_NAMES.page)) ?? 1,
  };

  // Pass null to remove a filter. Changing any filter goes back to page 1.
  function setFilter(name: FilterName, value: string | number | null) {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        const isDefault =
          value === null ||
          value === "" ||
          (name === "sort" && value === DEFAULT_SORT) ||
          (name === "page" && value === 1);

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

  const activeFilterCount = [
    filters.search,
    filters.categoryId,
    filters.type,
    filters.status,
  ].filter(Boolean).length;

  return { filters, setFilter, clearFilters, activeFilterCount };
}
