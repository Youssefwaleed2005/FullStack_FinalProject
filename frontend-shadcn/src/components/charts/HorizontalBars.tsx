import { cn } from "@/lib/utils";

type HorizontalBarsProps = {
  items: { label: string; value: number }[];
  title: string;
  colors?: string[];
};

const DEFAULT_COLORS = ["bg-sky-500", "bg-teal-500", "bg-violet-500", "bg-rose-500", "bg-amber-500", "bg-emerald-500"];

// Labelled horizontal bars, e.g. enrollments per category
function HorizontalBars({ items, title, colors = DEFAULT_COLORS }: HorizontalBarsProps) {
  const max = Math.max(1, ...items.map((i) => i.value));
  const total = items.reduce((sum, i) => sum + i.value, 0);
  return (
    <figure>
      <figcaption className="sr-only">{title}</figcaption>
      <ul className="flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={item.label}>
            <div className="flex justify-between text-sm">
              <span className="font-medium">{item.label}</span>
              <span className="tabular-nums text-muted-foreground">
                {item.value} {total > 0 && <span className="text-xs">({Math.round((item.value / total) * 100)}%)</span>}
              </span>
            </div>
            <span className="mt-1 block h-2.5 overflow-hidden rounded-full bg-secondary">
              <span
                className={cn("block h-full rounded-full transition-all duration-700", colors[index % colors.length])}
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export default HorizontalBars;
