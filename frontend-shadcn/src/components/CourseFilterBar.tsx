import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CourseFilters } from "@/hooks/useCourseFilters";
import {
  COURSE_TYPES,
  FILTERABLE_STATUSES,
  SORT_OPTIONS,
  STATUS_META,
} from "@/lib/course";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/Category";

// The Select component does not allow an empty value, so "all" stands for "no filter"
const ALL = "all";

const triggerStyle =
  "w-full rounded-full border-border bg-card px-4 shadow-xs data-[size=default]:h-10";

type CourseFilterBarProps = {
  filters: CourseFilters;
  categories: Category[];
  activeFilterCount: number;
  onFilterChange: (
    name: "search" | "categoryId" | "type" | "status" | "sort",
    value: string | number | null,
  ) => void;
  onClear: () => void;
};

function CourseFilterBar({
  filters,
  categories,
  activeFilterCount,
  onFilterChange,
  onClear,
}: CourseFilterBarProps) {
  const selectedCategory = categories.find(
    (category) => category.id === filters.categoryId,
  );

  // Removable chips that summarise what is currently filtering the list
  const activeChips = [
    filters.search && {
      key: "search",
      label: `“${filters.search}”`,
      remove: () => onFilterChange("search", null),
    },
    filters.categoryId && {
      key: "category",
      label: selectedCategory?.name ?? "Category",
      remove: () => onFilterChange("categoryId", null),
    },
    filters.type && {
      key: "type",
      label: filters.type,
      remove: () => onFilterChange("type", null),
    },
    filters.status && {
      key: "status",
      label: STATUS_META[filters.status].label,
      remove: () => onFilterChange("status", null),
    },
  ].filter((chip) => !!chip);

  return (
    <div className="space-y-4">
      {/* Category chips: scroll sideways on small screens */}
      {categories.length > 0 && (
        <div
          role="group"
          aria-label="Filter by category"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          <CategoryChip
            label="All courses"
            selected={filters.categoryId === null}
            onClick={() => onFilterChange("categoryId", null)}
          />
          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              label={category.name}
              selected={filters.categoryId === category.id}
              onClick={() => onFilterChange("categoryId", category.id)}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
        <Select
          value={filters.type ?? ALL}
          onValueChange={(value) =>
            onFilterChange("type", value === ALL ? null : value)
          }
        >
          <SelectTrigger
            aria-label="Filter by format"
            className={cn(triggerStyle, "sm:w-40")}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Any format</SelectItem>
            {COURSE_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status ?? ALL}
          onValueChange={(value) =>
            onFilterChange("status", value === ALL ? null : value)
          }
        >
          <SelectTrigger
            aria-label="Filter by status"
            className={cn(triggerStyle, "sm:w-52")}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Any status</SelectItem>
            {FILTERABLE_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_META[status].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sort}
          onValueChange={(value) => onFilterChange("sort", value)}
        >
          <SelectTrigger
            aria-label="Sort courses"
            className={cn(triggerStyle, "col-span-2 sm:ml-auto sm:w-52")}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1 rounded-full bg-accent py-1 pr-1 pl-3 text-sm font-medium text-accent-foreground"
            >
              {chip.label}
              <button
                type="button"
                onClick={chip.remove}
                aria-label={`Remove filter ${chip.label}`}
                className="flex size-5 items-center justify-center rounded-full transition-colors outline-none hover:bg-primary/10 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
          <Button variant="link" size="sm" onClick={onClear}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}

type CategoryChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function CategoryChip({ label, selected, onClick }: CategoryChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-sand hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

export default CourseFilterBar;
