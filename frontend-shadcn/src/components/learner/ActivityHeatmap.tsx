import { Flame, Trophy, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiData } from "@/hooks/useApiData";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getActivity } from "@/services/learnerService";

const LEVELS = [
  "bg-secondary dark:bg-secondary/60",
  "bg-sand/40",
  "bg-sand/70",
  "bg-sand-deep",
  "bg-primary dark:bg-sand",
];

function levelFor(count: number) {
  return count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count <= 4 ? 3 : 4;
}

const dayFormat = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });
const monthFormat = new Intl.DateTimeFormat("en-GB", { month: "short" });

// GitHub-style grid of the last 18 weeks of learning + current / longest streak
function ActivityHeatmap() {
  const { data, loading } = useApiData(getActivity);

  if (loading) return <Skeleton className="h-52 rounded-2xl" />;
  if (!data) return null;

  // Columns = weeks (Sunday first), padded so the first day sits on its weekday
  const first = new Date(`${data.days[0]?.date}T00:00:00`);
  const cells: ({ date: string; count: number } | null)[] = [
    ...Array.from({ length: first.getDay() }, () => null),
    ...data.days,
  ];
  const weeks: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const stats = [
    { icon: Flame, label: "Current streak", value: `${data.currentStreak} day${data.currentStreak === 1 ? "" : "s"}`, tone: "text-orange-500" },
    { icon: Trophy, label: "Longest streak", value: `${data.longestStreak} day${data.longestStreak === 1 ? "" : "s"}`, tone: "text-amber-500" },
    { icon: Zap, label: "Learning actions", value: String(data.totalActions), tone: "text-sand-deep" },
  ];

  return (
    <section className={cn(panelStyle, "p-6")}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Your learning activity</h2>
          <p className="text-sm text-muted-foreground">Sessions attended, assignments submitted and materials completed.</p>
        </div>
        <ul className="flex flex-wrap gap-5">
          {stats.map((stat) => (
            <li key={stat.label} className="flex items-center gap-2">
              <stat.icon aria-hidden className={cn("size-5", stat.tone, stat.icon === Flame && data.currentStreak > 0 && "animate-pulse")} />
              <span>
                <span className="block text-sm font-semibold">{stat.value}</span>
                <span className="block text-xs text-muted-foreground">{stat.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 overflow-x-auto pb-1">
        <div role="img" aria-label={`${data.totalActions} learning actions in the last 18 weeks`} className="inline-flex gap-1">
          {weeks.map((week, w) => {
            const firstReal = week.find(Boolean);
            const showMonth = firstReal && new Date(`${firstReal.date}T00:00:00`).getDate() <= 7;
            return (
              <div key={w} className="flex flex-col gap-1">
                <span aria-hidden className="h-4 text-[0.65rem] text-muted-foreground">
                  {showMonth ? monthFormat.format(new Date(`${firstReal!.date}T00:00:00`)) : ""}
                </span>
                {week.map((day, d) =>
                  day ? (
                    <span
                      key={day.date}
                      title={`${dayFormat.format(new Date(`${day.date}T00:00:00`))}: ${day.count} action${day.count === 1 ? "" : "s"}`}
                      className={cn("size-3.5 rounded-[3px] transition-transform hover:scale-125", LEVELS[levelFor(day.count)])}
                    />
                  ) : (
                    <span key={`pad-${d}`} className="size-3.5" />
                  ),
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div aria-hidden className="mt-3 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
        Less
        {LEVELS.map((level) => (
          <span key={level} className={cn("size-3 rounded-[3px]", level)} />
        ))}
        More
      </div>
    </section>
  );
}

export default ActivityHeatmap;
