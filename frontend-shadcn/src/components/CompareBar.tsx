import { Link, useLocation } from "react-router-dom";
import { GitCompareArrows, X } from "lucide-react";
import TopicCover from "@/components/TopicCover";
import { useCompare } from "@/hooks/useCompare";
import { clearCompare, MAX_COMPARE, toggleCompare } from "@/lib/compare";

// Floating tray at the bottom while courses are picked for comparison
function CompareBar() {
  const picked = useCompare();
  const { pathname } = useLocation();
  if (picked.length === 0 || pathname === "/compare") return null;

  return (
    <div
      role="region"
      aria-label="Courses to compare"
      className="fixed bottom-5 left-1/2 z-40 flex w-[min(40rem,calc(100vw-2rem))] -translate-x-1/2 items-center gap-3 rounded-2xl border border-border/80 bg-background/95 p-3 shadow-2xl shadow-primary/20 backdrop-blur duration-300 animate-in fade-in slide-in-from-bottom-4"
    >
      <ul className="flex min-w-0 flex-1 gap-2">
        {Array.from({ length: MAX_COMPARE }, (_, i) => picked[i]).map((course, i) =>
          course ? (
            <li key={course.id} className="relative flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-secondary/60 p-1.5 pr-7">
              <span className="size-9 shrink-0 overflow-hidden rounded-lg">
                <TopicCover title={course.title} hint={course.categoryName} className="size-full" />
              </span>
              <span className="truncate text-xs font-medium">{course.title}</span>
              <button
                type="button"
                aria-label={`Remove ${course.title}`}
                onClick={() => toggleCompare(course)}
                className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ) : (
            <li key={`empty-${i}`} className="hidden flex-1 items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground sm:flex">
              Add a course
            </li>
          ),
        )}
      </ul>
      <div className="flex shrink-0 flex-col gap-1">
        <Link
          to="/compare"
          aria-disabled={picked.length < 2}
          onClick={(e) => picked.length < 2 && e.preventDefault()}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground outline-none aria-disabled:opacity-50 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <GitCompareArrows aria-hidden className="size-4" /> Compare ({picked.length})
        </Link>
        <button type="button" onClick={clearCompare} className="text-xs text-muted-foreground underline-offset-4 hover:underline">
          Clear
        </button>
      </div>
    </div>
  );
}

export default CompareBar;
