import type { LucideIcon } from "lucide-react";
import CountUp from "@/components/fun/CountUp";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";

type StatTileProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  hint?: string;
  // Shown before / after the counting number, e.g. "EGP "
  prefix?: string;
  suffix?: string;
  // Highlight tiles that need attention
  tone?: "default" | "warning";
};

// Number card used on the instructor and admin dashboards
function StatTile({ label, value, icon: Icon, hint, prefix, suffix, tone = "default" }: StatTileProps) {
  return (
    <div
      className={cn(
        panelStyle,
        "group flex items-start gap-4 p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 motion-reduce:hover:translate-y-0",
        tone === "warning" && value > 0 && "border-amber-300 bg-amber-50/60",
      )}
    >
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6",
          tone === "warning" && value > 0
            ? "bg-amber-100 text-amber-700"
            : "bg-sand/15 text-sand-deep",
        )}
      >
        <Icon aria-hidden className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 font-heading text-3xl font-semibold">
          {prefix}
          <CountUp value={value} />
          {suffix}
        </p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

export default StatTile;
