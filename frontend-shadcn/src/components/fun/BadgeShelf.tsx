import { Lock } from "lucide-react";
import type { Badge } from "@/lib/badges";
import { cn } from "@/lib/utils";

type BadgeShelfProps = {
  badges: Badge[];
  title?: string;
};

// Earned badges glow in sand; locked ones are greyed out with a hint
function BadgeShelf({ badges, title = "Achievements" }: BadgeShelfProps) {
  const earned = badges.filter((b) => b.earned).length;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-muted-foreground">
          {earned} / {badges.length} earned
        </span>
      </div>

      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <li
              key={badge.id}
              title={badge.description}
              style={{ animationDelay: `${index * 80}ms` }}
              className={cn(
                "group flex flex-col items-center rounded-2xl border p-3 text-center transition duration-300 fill-mode-both animate-in fade-in zoom-in-90 motion-reduce:animate-none",
                badge.earned
                  ? "border-sand/70 bg-linear-to-b from-accent to-card hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sand/30"
                  : "border-dashed border-border bg-muted/40",
              )}
            >
              <span
                className={cn(
                  "relative flex size-12 items-center justify-center rounded-full",
                  badge.earned
                    ? "bg-sand text-primary shadow-md shadow-sand/50 group-hover:animate-bounce motion-reduce:group-hover:animate-none"
                    : "bg-muted text-muted-foreground/60",
                )}
              >
                <Icon aria-hidden className="size-6" strokeWidth={1.75} />
                {!badge.earned && (
                  <Lock
                    aria-hidden
                    className="absolute -right-1 -bottom-1 size-4 rounded-full bg-card p-0.5 text-muted-foreground"
                  />
                )}
              </span>
              <span
                className={cn(
                  "mt-2 text-sm font-semibold",
                  !badge.earned && "text-muted-foreground",
                )}
              >
                {badge.title}
              </span>
              <span className="mt-0.5 text-xs leading-snug text-muted-foreground">
                {badge.earned ? "Unlocked!" : badge.description}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default BadgeShelf;
