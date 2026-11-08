import { cn } from "@/lib/utils";

export type Bar = { label: string; value: number; hint?: string };

type BarChartProps = {
  bars: Bar[];
  // Text for screen readers, e.g. "Submissions per week"
  title: string;
  formatValue?: (value: number) => string;
  barClassName?: string;
  height?: string;
};

// Simple vertical bar chart (no chart library): value on top, label underneath
function BarChart({ bars, title, formatValue = String, barClassName = "bg-primary", height = "h-40" }: BarChartProps) {
  const max = Math.max(1, ...bars.map((b) => b.value));
  return (
    <figure>
      <figcaption className="sr-only">{title}</figcaption>
      <ul className={cn("flex items-end gap-2", height)}>
        {bars.map((bar) => (
          <li key={bar.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-1" title={bar.hint ?? `${bar.label}: ${formatValue(bar.value)}`}>
            <span className="text-[0.7rem] font-semibold tabular-nums text-muted-foreground opacity-80 group-hover:opacity-100">
              {bar.value > 0 ? formatValue(bar.value) : ""}
            </span>
            <span
              className={cn("w-full max-w-12 rounded-t-md transition-all duration-700 group-hover:opacity-80", barClassName, bar.value === 0 && "opacity-25")}
              style={{ height: `${Math.max(4, (bar.value / max) * 100)}%` }}
            />
            <span className="sr-only">{`${bar.label}: ${formatValue(bar.value)}`}</span>
          </li>
        ))}
      </ul>
      <ul aria-hidden className="mt-2 flex gap-2">
        {bars.map((bar) => (
          <li key={bar.label} className="flex-1 truncate text-center text-[0.7rem] text-muted-foreground">
            {bar.label}
          </li>
        ))}
      </ul>
    </figure>
  );
}

export default BarChart;
