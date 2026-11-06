import {
  dayFormat,
  dayKey,
  eventDate,
  eventTitle,
  eventTone,
  isSameMonth,
  monthGrid,
  timeFormat,
  WEEKDAYS,
} from "@/lib/calendar";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/Learner";

// Chips per day on larger screens; the rest become "+N more"
const MAX_CHIPS = 3;

type CalendarMonthProps = {
  month: Date;
  byDay: Map<string, CalendarEvent[]>;
  selected: Date;
  onSelect: (date: Date) => void;
};

// "Monday 3 November: 1 session, 2 deadlines"
function dayLabel(date: Date, events: CalendarEvent[]): string {
  const sessions = events.filter((event) => event.kind === "session").length;
  const deadlines = events.length - sessions;
  const parts = [
    sessions && `${sessions} ${sessions === 1 ? "session" : "sessions"}`,
    deadlines && `${deadlines} ${deadlines === 1 ? "deadline" : "deadlines"}`,
  ].filter(Boolean);
  return `${dayFormat.format(date)}: ${parts.length ? parts.join(", ") : "nothing scheduled"}`;
}

// Month grid. Phones get coloured dots per day; larger screens get the event titles.
function CalendarMonth({ month, byDay, selected, onSelect }: CalendarMonthProps) {
  const todayKey = dayKey(new Date());
  const selectedKey = dayKey(selected);

  return (
    <div className={cn(panelStyle, "overflow-hidden")}>
      <div
        aria-hidden
        className="grid grid-cols-7 border-b border-border/70 bg-secondary/50 text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase"
      >
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2.5">
            {day}
          </div>
        ))}
      </div>

      <ol className="grid grid-cols-7">
        {monthGrid(month).map((date, index) => {
          const key = dayKey(date);
          const events = byDay.get(key) ?? [];
          const inMonth = isSameMonth(date, month);
          const isToday = key === todayKey;
          const isSelected = key === selectedKey;

          return (
            <li
              key={key}
              className={cn("border-border/70", index % 7 !== 6 && "border-r", index >= 7 && "border-t")}
            >
              <button
                type="button"
                aria-pressed={isSelected}
                aria-label={dayLabel(date, events)}
                onClick={() => onSelect(date)}
                className={cn(
                  "flex h-full min-h-16 w-full flex-col gap-1 p-1.5 text-left outline-none transition-colors hover:bg-secondary/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset sm:min-h-28 sm:p-2",
                  !inMonth && "bg-muted/40 text-muted-foreground/70",
                  isSelected && "bg-accent hover:bg-accent",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 items-center justify-center self-center rounded-full text-sm font-medium sm:self-start",
                    isToday && "bg-primary font-semibold text-primary-foreground",
                  )}
                >
                  {date.getDate()}
                </span>

                {/* Phones: one dot per event */}
                {events.length > 0 && (
                  <span aria-hidden className="flex flex-wrap justify-center gap-1 sm:hidden">
                    {events.slice(0, 4).map((event) => (
                      <span key={event.key} className={cn("size-1.5 rounded-full", eventTone(event).dot)} />
                    ))}
                  </span>
                )}

                {/* Larger screens: the titles */}
                {events.length > 0 && (
                  <span aria-hidden className="hidden min-w-0 flex-col gap-1 sm:flex">
                    {events.slice(0, MAX_CHIPS).map((event) => (
                      <span
                        key={event.key}
                        className={cn("truncate rounded-md px-1.5 py-0.5 text-[0.7rem] font-medium", eventTone(event).chip)}
                      >
                        {event.kind === "session" ? timeFormat.format(eventDate(event)) : "Due"} {eventTitle(event)}
                      </span>
                    ))}
                    {events.length > MAX_CHIPS && (
                      <span className="px-1.5 text-[0.7rem] font-medium text-muted-foreground">
                        +{events.length - MAX_CHIPS} more
                      </span>
                    )}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default CalendarMonth;
