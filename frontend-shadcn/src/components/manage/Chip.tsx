import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const TONES = {
  neutral: "bg-secondary text-secondary-foreground",
  success: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200",
  warning: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200",
  danger: "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200",
  info: "bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200",
  outline: "bg-card text-foreground ring-1 ring-border",
} as const;

export type ChipTone = keyof typeof TONES;

// Small rounded label, e.g. "3 to grade" or "Late"
function Chip({ tone = "neutral", children, className }: { tone?: ChipTone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Chip;
