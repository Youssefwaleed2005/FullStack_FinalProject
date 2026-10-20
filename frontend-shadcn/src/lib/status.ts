import type { ApplicationStatus } from "@/types/Application";
import type { EnrollmentStatus } from "@/types/Enrollment";
import type { AttendanceStatus } from "@/types/Lms";
import type { PaymentStatus } from "@/types/Payment";

// Label and dot color for each status, shown with <StatusPill />
export type StatusMeta = { label: string; dot: string };

export const APPLICATION_STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  Submitted: { label: "Submitted", dot: "bg-amber-500" },
  Accepted: { label: "Accepted", dot: "bg-emerald-500" },
  Rejected: { label: "Rejected", dot: "bg-rose-500" },
  Cancelled: { label: "Cancelled", dot: "bg-stone-400" },
};

export const ENROLLMENT_STATUS_META: Record<EnrollmentStatus, StatusMeta> = {
  Active: { label: "Active", dot: "bg-emerald-500" },
  Paused: { label: "Paused", dot: "bg-amber-500" },
  Completed: { label: "Completed", dot: "bg-sky-500" },
  Cancelled: { label: "Cancelled", dot: "bg-stone-400" },
};

export const ATTENDANCE_STATUS_META: Record<AttendanceStatus, StatusMeta> = {
  Present: { label: "Present", dot: "bg-emerald-500" },
  Late: { label: "Late", dot: "bg-amber-500" },
  Absent: { label: "Absent", dot: "bg-rose-500" },
  Excused: { label: "Excused", dot: "bg-stone-400" },
};

export const PAYMENT_STATUS_META: Record<PaymentStatus, StatusMeta> = {
  Paid: { label: "Paid", dot: "bg-emerald-500" },
  Pending: { label: "Pending", dot: "bg-amber-500" },
  Failed: { label: "Failed", dot: "bg-rose-500" },
  Refunded: { label: "Refunded", dot: "bg-stone-400" },
};
