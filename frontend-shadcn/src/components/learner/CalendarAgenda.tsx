import { Link } from "react-router-dom";
import { CalendarClock, ClipboardList, MapPin } from "lucide-react";
import Chip, { type ChipTone } from "@/components/manage/Chip";
import StatusPill from "@/components/StatusPill";
import { deadlineState, eventDate, eventTitle, eventTone, timeFormat, type DeadlineState } from "@/lib/calendar";
import { toDate } from "@/lib/dates";
import { ATTENDANCE_STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/Learner";

const DEADLINE_CHIPS: Record<DeadlineState, { tone: ChipTone; label: string }> = {
  due: { tone: "warning", label: "To do" },
  overdue: { tone: "danger", label: "Overdue" },
  submitted: { tone: "info", label: "Submitted" },
  graded: { tone: "success", label: "Graded" },
};

// "18:00 – 20:00" for a session, "Due 23:59" for a deadline
function whenText(event: CalendarEvent): string {
  if (event.kind === "deadline") return `Due ${timeFormat.format(eventDate(event))}`;
  return `${timeFormat.format(eventDate(event))} – ${timeFormat.format(toDate(event.session.endTime))}`;
}

function EventStatus({ event }: { event: CalendarEvent }) {
  if (event.kind === "session") {
    const attendance = event.session.myAttendance;
    if (attendance) return <StatusPill status={ATTENDANCE_STATUS_META[attendance]} />;
    return event.session.isPast ? null : <Chip>Upcoming</Chip>;
  }
  const { mySubmission, maxScore } = event.assignment;
  const state = deadlineState(event.assignment);
  const chip = DEADLINE_CHIPS[state];
  return (
    <Chip tone={chip.tone}>
      {state === "graded" && mySubmission?.score != null ? `Graded ${mySubmission.score}/${maxScore}` : chip.label}
    </Chip>
  );
}

// The events of one day as cards that open the course
function CalendarAgenda({ events }: { events: CalendarEvent[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {events.map((event) => {
        const Icon = event.kind === "session" ? CalendarClock : ClipboardList;
        const location = event.kind === "session" ? event.session.location : null;
        return (
          <li key={event.key}>
            <Link
              to={`/learning/courses/${event.courseId}`}
              className="flex gap-3 rounded-xl border border-border/80 bg-card p-3 outline-none transition-colors hover:border-sand focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span
                aria-hidden
                className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", eventTone(event).chip)}
              >
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {event.kind === "session" ? "Session" : "Deadline"} · {whenText(event)}
                </span>
                <span className="mt-0.5 block truncate font-semibold">{eventTitle(event)}</span>
                <span className="block truncate text-sm text-muted-foreground">{event.courseTitle}</span>
                {location && (
                  <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <MapPin aria-hidden className="size-3.5 shrink-0" /> {location}
                  </span>
                )}
                <span className="mt-2 flex">
                  <EventStatus event={event} />
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default CalendarAgenda;
