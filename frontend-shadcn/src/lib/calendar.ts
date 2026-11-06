// Helpers for the learner calendar (month grid, grouping by day, colours per event)
import { toDate } from "@/lib/dates";
import type { CalendarEvent, LearnerAssignment } from "@/types/Learner";

// Weeks start on Monday, like the en-GB formats used across the site
export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const timeFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });
export const monthFormat = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
export const dayFormat = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" });

// When the event happens: a session's start, an assignment's due date (local time)
export function eventDate(event: CalendarEvent): Date {
  return toDate(event.kind === "session" ? event.session.startTime : event.assignment.dueDate);
}

export function eventTitle(event: CalendarEvent): string {
  return event.kind === "session" ? event.session.title : event.assignment.title;
}

// The local calendar day, e.g. "2026-11-03" (not UTC, so a late-evening session lands on the right day)
export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

// The days shown for a month: whole weeks, Monday first, with the edges of the months around it
export function monthGrid(month: Date): Date[] {
  const first = startOfMonth(month);
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const total = Math.ceil((offset + daysInMonth) / 7) * 7;
  return Array.from(
    { length: total },
    (_, index) => new Date(first.getFullYear(), first.getMonth(), 1 - offset + index),
  );
}

// dayKey → that day's events, in time order
export function groupByDay(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const sorted = [...events].sort((a, b) => eventDate(a).getTime() - eventDate(b).getTime());
  const byDay = new Map<string, CalendarEvent[]>();
  for (const event of sorted) {
    const key = dayKey(eventDate(event));
    byDay.set(key, [...(byDay.get(key) ?? []), event]);
  }
  return byDay;
}

export type DeadlineState = "graded" | "submitted" | "overdue" | "due";

export function deadlineState(assignment: LearnerAssignment): DeadlineState {
  if (assignment.mySubmission?.status === "Graded") return "graded";
  if (assignment.mySubmission) return "submitted";
  return assignment.isPastDue ? "overdue" : "due";
}

// Chip and dot colours: sessions in sand, open deadlines in brown, overdue in red, done ones greyed out
export function eventTone(event: CalendarEvent): { chip: string; dot: string } {
  if (event.kind === "session") {
    return event.session.isPast
      ? { chip: "bg-muted text-muted-foreground", dot: "bg-muted-foreground/50" }
      : { chip: "bg-sand/25 text-foreground", dot: "bg-sand-deep" };
  }
  switch (deadlineState(event.assignment)) {
    case "overdue":
      return { chip: "bg-destructive/10 text-destructive", dot: "bg-destructive" };
    case "due":
      return { chip: "bg-primary text-primary-foreground", dot: "bg-primary dark:bg-primary-foreground" };
    default:
      return { chip: "bg-muted text-muted-foreground line-through", dot: "bg-muted-foreground/50" };
  }
}
