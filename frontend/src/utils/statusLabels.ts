import type { Course } from "../types/Course";

export const STATUS_LABELS: Record<Course["status"], string> = {
  Draft: "Draft",
  ComingSoon: "Coming soon",
  OpenForEnrollment: "Open for enrollment",
  Full: "Full",
  InProgress: "In progress",
  Completed: "Completed",
};

// Chip color for each status (used on the cards and details pages)
export const STATUS_COLORS: Record<
  Course["status"],
  "success" | "info" | "warning" | "error" | "default"
> = {
  Draft: "default",
  ComingSoon: "info",
  OpenForEnrollment: "success",
  Full: "error",
  InProgress: "warning",
  Completed: "default",
};
