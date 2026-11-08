import { useCallback, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check, CloudOff, GitCompareArrows, Minus, X } from "lucide-react";
import ApplyButton from "@/components/ApplyButton";
import PageHeader from "@/components/PageHeader";
import PageSkeleton from "@/components/PageSkeleton";
import { StarRating } from "@/components/StarRating";
import StateMessage from "@/components/StateMessage";
import StatusPill from "@/components/StatusPill";
import TopicCover from "@/components/TopicCover";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/hooks/useApiData";
import { useCompare } from "@/hooks/useCompare";
import { clearCompare, toggleCompare } from "@/lib/compare";
import { STATUS_META, formatDate, formatPrice } from "@/lib/course";
import { pageContainer, panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getCourseById } from "@/services/courseService";
import type { CourseDetails } from "@/types/Course";

type Row = { label: string; value: (c: CourseDetails) => ReactNode; best?: (all: CourseDetails[]) => number | null };

const ROWS: Row[] = [
  { label: "Price", value: (c) => formatPrice(c.price), best: (all) => minId(all, (c) => c.price) },
  { label: "Rating", value: (c) => (c.reviewCount ? <span className="inline-flex items-center gap-1.5"><StarRating value={c.averageRating ?? 0} /> {c.averageRating?.toFixed(1)} ({c.reviewCount})</span> : <span className="text-muted-foreground">No reviews yet</span>), best: (all) => maxId(all, (c) => c.averageRating ?? 0) },
  { label: "Duration", value: (c) => `${c.durationHours} hours` },
  { label: "Format", value: (c) => (c.type === "Online" ? "Online" : `On campus${c.location ? ` · ${c.location}` : ""}`) },
  { label: "Starts", value: (c) => (c.startDate ? formatDate(c.startDate) : "TBA") },
  { label: "Ends", value: (c) => (c.endDate ? formatDate(c.endDate) : "TBA") },
  { label: "Schedule", value: (c) => c.schedule ?? "–" },
  { label: "Seats", value: (c) => `${c.capacity} students` },
  { label: "Instructor", value: (c) => c.instructorName ?? "To be announced" },
  { label: "Category", value: (c) => c.categoryName },
];

function minId(all: CourseDetails[], pick: (c: CourseDetails) => number) {
  if (all.length < 2) return null;
  return all.reduce((best, c) => (pick(c) < pick(best) ? c : best)).id;
}
function maxId(all: CourseDetails[], pick: (c: CourseDetails) => number) {
  if (all.length < 2 || all.every((c) => pick(c) === 0)) return null;
  return all.reduce((best, c) => (pick(c) > pick(best) ? c : best)).id;
}

// Side-by-side table of the courses picked with "Compare"
function ComparePage() {
  const picked = useCompare();
  const ids = picked.map((c) => c.id).join(",");
  const load = useCallback(
    () => Promise.all(ids ? ids.split(",").map((id) => getCourseById(Number(id))) : []),
    [ids],
  );
  const { data: courses, loading, failed, reload } = useApiData(load);

  return (
    <>
      <PageHeader eyebrow="Compare" title="Compare courses" description="See price, schedule, format and ratings side by side." />
      <div className={cn(pageContainer, "py-10")}>
        {picked.length < 2 ? (
          <StateMessage
            icon={GitCompareArrows}
            title="Pick at least two courses"
            description='Use the "Compare" button on course cards to add up to three courses.'
            action={
              <Button asChild size="lg" className="rounded-full px-5">
                <Link to="/courses">Browse courses</Link>
              </Button>
            }
          />
        ) : loading && !courses ? (
          <PageSkeleton variant="table" />
        ) : courses ? (
          <div className={cn(panelStyle, "overflow-x-auto")}>
            <table className="w-full min-w-[40rem] table-fixed text-sm">
              <caption className="sr-only">Course comparison</caption>
              <thead>
                <tr>
                  <th scope="col" className="w-36 p-4 text-left align-bottom">
                    <button type="button" onClick={clearCompare} className="text-xs font-medium text-muted-foreground underline-offset-4 hover:underline">
                      Clear all
                    </button>
                  </th>
                  {courses.map((course) => (
                    <th key={course.id} scope="col" className="p-4 text-left align-top font-normal">
                      <div className="relative overflow-hidden rounded-xl">
                        <TopicCover title={course.title} hint={course.categoryName} className="aspect-[16/9] w-full" />
                        <button
                          type="button"
                          aria-label={`Remove ${course.title}`}
                          onClick={() => toggleCompare(course)}
                          className="absolute top-2 right-2 rounded-full bg-card/95 p-1 shadow outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                      <Link to={`/courses/${course.id}`} className="mt-3 block font-heading text-lg font-semibold underline-offset-4 hover:underline">
                        {course.title}
                      </Link>
                      <StatusPill status={STATUS_META[course.status]} className="mt-2" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => {
                  const bestId = row.best?.(courses) ?? null;
                  return (
                    <tr key={row.label} className="border-t border-border/70">
                      <th scope="row" className="p-4 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        {row.label}
                      </th>
                      {courses.map((course) => (
                        <td key={course.id} className={cn("p-4", bestId === course.id && "bg-emerald-50 font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300")}>
                          <span className="inline-flex items-center gap-1.5">
                            {row.value(course)}
                            {bestId === course.id && <Check aria-label="best" className="size-4" />}
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
                <tr className="border-t border-border/70">
                  <th scope="row" className="p-4 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    What you learn
                  </th>
                  {courses.map((course) => (
                    <td key={course.id} className="p-4 align-top">
                      <ul className="flex flex-col gap-1.5">
                        {(course.objectives ?? "").split("\n").map((o) => o.trim()).filter(Boolean).slice(0, 5).map((o) => (
                          <li key={o} className="flex gap-1.5 text-xs">
                            <Check aria-hidden className="mt-0.5 size-3.5 shrink-0 text-sand-deep" />
                            {o}
                          </li>
                        ))}
                        {!course.objectives && <Minus aria-label="Not listed" className="size-4 text-muted-foreground" />}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border/70">
                  <th scope="row" className="p-4" />
                  {courses.map((course) => (
                    <td key={course.id} className="p-4">
                      <ApplyButton courseId={course.id} status={course.status} />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : failed ? (
          <StateMessage
            icon={CloudOff}
            title="We couldn't load these courses"
            description="One of them may have been removed. Try again or clear the list."
            action={
              <div className="flex gap-2">
                <Button size="lg" className="rounded-full px-5" onClick={reload}>
                  Try again
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-5" onClick={clearCompare}>
                  Clear list
                </Button>
              </div>
            }
          />
        ) : null}
      </div>
    </>
  );
}

export default ComparePage;
