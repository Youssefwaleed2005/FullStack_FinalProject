import { useCallback, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiData } from "@/hooks/useApiData";
import { formatDateTime } from "@/lib/course";
import { cn } from "@/lib/utils";
import { getCourseSchedule } from "@/services/courseService";

// "Course outline": the planned sessions as an accordion (from GET /api/courses/{id}/schedule)
function CourseSchedule({ courseId }: { courseId: number }) {
  const load = useCallback(() => getCourseSchedule(courseId), [courseId]);
  const { data: sessions, loading } = useApiData(load);
  const [openId, setOpenId] = useState<number | null>(null);

  if (loading)
    return (
      <section aria-busy>
        <Skeleton className="h-7 w-48" />
        <div className="mt-5 flex flex-col gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </section>
    );
  // Nothing planned yet (or the request failed): leave the section out
  if (!sessions || sessions.length === 0) return null;

  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-semibold">Course outline</h2>
        <p className="text-sm text-muted-foreground">
          {sessions.length} session{sessions.length === 1 ? "" : "s"} planned
        </p>
      </div>
      <ol className="mt-5 flex flex-col gap-2">
        {sessions.map((session, index) => {
          const open = openId === session.id;
          const panelId = `session-panel-${session.id}`;
          return (
            <li key={session.id} className="overflow-hidden rounded-xl border border-border/80 bg-card">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : session.id)}
                className="flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors outline-none hover:bg-secondary/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{session.title}</span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays aria-hidden className="size-3.5" />
                    {formatDateTime(session.startTime)}
                  </span>
                </span>
                <ChevronDown
                  aria-hidden
                  className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")}
                />
              </button>
              {open && (
                <div id={panelId} className="border-t border-border/60 px-4 py-3 pl-16 text-sm text-muted-foreground">
                  {session.description || "Details will be shared by your instructor."}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default CourseSchedule;
