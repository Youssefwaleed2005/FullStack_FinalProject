import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarX2, ChevronLeft, ChevronRight, CloudOff } from "lucide-react";
import AccountLayout from "@/components/AccountLayout";
import CalendarAgenda from "@/components/learner/CalendarAgenda";
import CalendarMonth from "@/components/learner/CalendarMonth";
import PageSkeleton from "@/components/PageSkeleton";
import StateMessage from "@/components/StateMessage";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/hooks/useApiData";
import {
  addMonths,
  dayFormat,
  dayKey,
  eventDate,
  groupByDay,
  isSameMonth,
  monthFormat,
  startOfMonth,
} from "@/lib/calendar";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { getLearnerCalendar } from "@/services/learnerService";

// How many future events the "Coming up" list shows
const UPCOMING_COUNT = 4;

const legend = [
  { label: "Session", dot: "bg-sand-deep" },
  { label: "Deadline", dot: "bg-primary dark:bg-primary-foreground" },
  { label: "Overdue", dot: "bg-destructive" },
  { label: "Done / past", dot: "bg-muted-foreground/50" },
];

// Month view of the learner's sessions and assignment deadlines across all their courses
function LearnerCalendarPage() {
  const { data, loading, failed, error, reload } = useApiData(getLearnerCalendar);
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState(() => new Date());

  const events = useMemo(() => data?.events ?? [], [data]);
  const byDay = useMemo(() => groupByDay(events), [events]);

  // "Past" comes from the API (worked out when the calendar loaded), so rendering stays pure
  const upcoming = useMemo(
    () =>
      events
        .filter((event) => (event.kind === "session" ? !event.session.isPast : !event.assignment.isPastDue))
        .sort((a, b) => eventDate(a).getTime() - eventDate(b).getTime())
        .slice(0, UPCOMING_COUNT),
    [events],
  );

  const inMonth = events.filter((event) => isSameMonth(eventDate(event), month));
  const sessionsInMonth = inMonth.filter((event) => event.kind === "session").length;
  const deadlinesInMonth = inMonth.length - sessionsInMonth;
  const selectedEvents = byDay.get(dayKey(selected)) ?? [];

  // Switching month selects today (if it's in that month) or the 1st
  function showMonth(next: Date) {
    const today = new Date();
    setMonth(next);
    setSelected(isSameMonth(today, next) ? today : next);
  }

  function selectDay(date: Date) {
    setSelected(date);
    if (!isSameMonth(date, month)) setMonth(startOfMonth(date));
  }

  return (
    <AccountLayout title="My calendar" description="Your upcoming sessions and assignment deadlines, month by month.">
      {loading && !data && <PageSkeleton variant="list" label="Loading your calendar…" />}

      {failed && (
        <StateMessage
          icon={CloudOff}
          title="Something went wrong"
          description={getApiErrorMessage(error, "Could not load your calendar.")}
          action={
            <Button variant="outline" className="rounded-full px-5" onClick={reload}>
              Try again
            </Button>
          }
        />
      )}

      {data && data.courseCount === 0 && (
        <StateMessage
          icon={CalendarX2}
          title="Nothing on your calendar yet"
          description="Once you're enrolled in a course, its sessions and deadlines show up here."
          action={
            <Button asChild className="rounded-full px-5">
              <Link to="/courses">Browse courses</Link>
            </Button>
          }
        />
      )}

      {data && data.courseCount > 0 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="flex min-w-0 flex-col gap-4">
            {/* Month switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold">{monthFormat.format(month)}</h2>
                <p className="text-sm text-muted-foreground">
                  {sessionsInMonth} {sessionsInMonth === 1 ? "session" : "sessions"} · {deadlinesInMonth}{" "}
                  {deadlinesInMonth === 1 ? "deadline" : "deadlines"} this month
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon-lg"
                  className="rounded-full"
                  aria-label="Previous month"
                  onClick={() => showMonth(addMonths(month, -1))}
                >
                  <ChevronLeft />
                </Button>
                <Button variant="outline" className="h-9 rounded-full px-4" onClick={() => showMonth(startOfMonth(new Date()))}>
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="icon-lg"
                  className="rounded-full"
                  aria-label="Next month"
                  onClick={() => showMonth(addMonths(month, 1))}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>

            <CalendarMonth month={month} byDay={byDay} selected={selected} onSelect={selectDay} />

            <ul aria-label="Legend" className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
              {legend.map((item) => (
                <li key={item.label} className="flex items-center gap-1.5">
                  <span aria-hidden className={cn("size-2 rounded-full", item.dot)} />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <section aria-labelledby="day-agenda-title" className={cn(panelStyle, "p-5")}>
              <h2 id="day-agenda-title" className="text-lg font-semibold">
                {dayFormat.format(selected)}
              </h2>
              <div className="mt-4">
                {selectedEvents.length > 0 ? (
                  <CalendarAgenda events={selectedEvents} />
                ) : (
                  <p className="text-sm text-muted-foreground">Nothing scheduled on this day.</p>
                )}
              </div>
            </section>

            <section aria-labelledby="coming-up-title" className={cn(panelStyle, "p-5")}>
              <h2 id="coming-up-title" className="text-lg font-semibold">
                Coming up
              </h2>
              <div className="mt-4">
                {upcoming.length > 0 ? (
                  <CalendarAgenda events={upcoming} />
                ) : (
                  <p className="text-sm text-muted-foreground">No upcoming sessions or deadlines.</p>
                )}
              </div>
            </section>
          </aside>
        </div>
      )}
    </AccountLayout>
  );
}

export default LearnerCalendarPage;
