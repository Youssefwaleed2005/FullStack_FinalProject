import type { Course } from "../types/Course";

export const STATUS_LABELS: Record<Course["status"], string> = {
  Draft: "Draft",
  ComingSoon: "Coming soon",
  OpenForEnrollment: "Open for enrollment",
  Full: "Full",
  InProgress: "In progress",
  Completed: "Completed",
};
