import type { CourseStatus, CourseType } from "@/types/Course";

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest", sortBy: "newest", sortDescending: false },
  {
    value: "priceAsc",
    label: "Price: low to high",
    sortBy: "price",
    sortDescending: false,
  },
  {
    value: "priceDesc",
    label: "Price: high to low",
    sortBy: "price",
    sortDescending: true,
  },
  {
    value: "titleAsc",
    label: "Title: A to Z",
    sortBy: "title",
    sortDescending: false,
  },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const DEFAULT_SORT: SortValue = "newest";

export const COURSE_TYPES: CourseType[] = ["Online", "Offline"];

// Label and dot color shown for each status. The API never returns Draft to the public.
export const STATUS_META: Record<CourseStatus, { label: string; dot: string }> =
  {
    Draft: { label: "Draft", dot: "bg-stone-400" },
    ComingSoon: { label: "Coming soon", dot: "bg-amber-500" },
    OpenForEnrollment: { label: "Open for enrollment", dot: "bg-emerald-500" },
    Full: { label: "Full", dot: "bg-rose-500" },
    InProgress: { label: "In progress", dot: "bg-sky-500" },
    Completed: { label: "Completed", dot: "bg-stone-400" },
  };

// Statuses offered in the catalog filter
export const FILTERABLE_STATUSES: CourseStatus[] = [
  "OpenForEnrollment",
  "ComingSoon",
  "InProgress",
  "Full",
  "Completed",
];

const priceFormatter = new Intl.NumberFormat("en-EG", {
  maximumFractionDigits: 0,
});

export function formatPrice(price: number): string {
  return price === 0 ? "Free" : `EGP ${priceFormatter.format(price)}`;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

// The API stores times in UTC but sends them without a "Z".
// Add the "Z" so the browser converts them to local time correctly.
function toDate(isoDate: string): Date {
  const hasZone = /[zZ]|[+-]\d\d:\d\d$/.test(isoDate);
  return new Date(
    isoDate.includes("T") && !hasZone ? `${isoDate}Z` : isoDate,
  );
}

export function formatDate(isoDate: string): string {
  return dateFormatter.format(toDate(isoDate));
}

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDateTime(isoDate: string): string {
  return dateTimeFormatter.format(toDate(isoDate));
}

// For amounts that come with their own currency, e.g. payments
export function formatAmount(amount: number, currency: string): string {
  return `${currency} ${priceFormatter.format(amount)}`;
}
