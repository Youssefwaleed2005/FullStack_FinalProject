import { Check, GitCompareArrows } from "lucide-react";
import { useCompare } from "@/hooks/useCompare";
import { useToast } from "@/hooks/useToast";
import { MAX_COMPARE, toggleCompare } from "@/lib/compare";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/Course";

// Small "Compare" pill on a course card
function CompareToggle({ course, className }: { course: Course; className?: string }) {
  const picked = useCompare().some((c) => c.id === course.id);
  const toast = useToast();

  return (
    <button
      type="button"
      aria-pressed={picked}
      aria-label={picked ? `Remove ${course.title} from comparison` : `Add ${course.title} to comparison`}
      onClick={() => {
        if (!toggleCompare(course)) toast.info(`You can compare up to ${MAX_COMPARE} courses`, "Remove one first.");
      }}
      className={cn(
        "relative z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur transition outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        picked ? "bg-primary text-primary-foreground" : "bg-card/95 text-foreground hover:bg-card",
        className,
      )}
    >
      {picked ? <Check aria-hidden className="size-3.5" /> : <GitCompareArrows aria-hidden className="size-3.5" />}
      {picked ? "Comparing" : "Compare"}
    </button>
  );
}

export default CompareToggle;
