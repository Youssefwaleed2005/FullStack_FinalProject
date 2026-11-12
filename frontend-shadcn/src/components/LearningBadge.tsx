import { CircleCheck, Clock } from "lucide-react";
import type { LearningState } from "@/lib/myLearningContext";
import { cn } from "@/lib/utils";

// "Enrolled" / "Completed" / "Payment pending" on a course or program card (nothing otherwise)
function LearningBadge({ state, className }: { state: LearningState; className?: string }) {
  if (!state) return null;

  const pending = state.kind === "pending";
  const label = pending ? "Payment pending" : state.status === "Completed" ? "Completed" : "Enrolled";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm",
        pending ? "bg-amber-400 text-amber-950" : "bg-emerald-600 text-white",
        className,
      )}
    >
      {pending ? <Clock aria-hidden className="size-3.5" /> : <CircleCheck aria-hidden className="size-3.5" />}
      {label}
    </span>
  );
}

export default LearningBadge;
