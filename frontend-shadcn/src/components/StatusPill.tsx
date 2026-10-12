import type { StatusMeta } from "@/lib/status";
import { cn } from "@/lib/utils";

type StatusPillProps = {
  status: StatusMeta;
  className?: string;
};

// Small rounded label with a colored dot, e.g. "● Open for enrollment"
function StatusPill({ status, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-xs font-medium text-foreground ring-1 ring-border",
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", status.dot)} />
      {status.label}
    </span>
  );
}

export default StatusPill;
