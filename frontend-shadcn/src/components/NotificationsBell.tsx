import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CalendarClock, CheckCheck, ClipboardList, FileText, Hourglass, Star, type LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateTime } from "@/lib/course";
import { cn } from "@/lib/utils";
import { getNotifications } from "@/services/learnerService";
import type { LearnerNotification, LearnerNotificationType } from "@/types/Notification";

const SEEN_KEY = "andalusia.notifications.seen";
const REFRESH_MS = 60_000;

const TYPE_META: Record<LearnerNotificationType, { icon: LucideIcon; tone: string }> = {
  Graded: { icon: Star, tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  NewMaterial: { icon: FileText, tone: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" },
  NewAssignment: { icon: ClipboardList, tone: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
  DueSoon: { icon: Hourglass, tone: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  SessionSoon: { icon: CalendarClock, tone: "bg-sand/20 text-sand-deep" },
};

function readSeen(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(SEEN_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSeen(ids: string[]) {
  try {
    // Keep the list short; old ids no longer come back from the API anyway
    localStorage.setItem(SEEN_KEY, JSON.stringify(ids.slice(-200)));
  } catch {
    // storage blocked: unread dots just reappear next visit
  }
}

// Bell in the navbar (learners): graded work, new materials, deadlines and sessions coming up
function NotificationsBell() {
  const [items, setItems] = useState<LearnerNotification[]>([]);
  const [seen, setSeen] = useState<string[]>(readSeen);

  const load = useCallback(() => {
    getNotifications()
      .then(setItems)
      .catch(() => {
        // The bell is an extra: if it fails we simply show nothing
      });
  }, []);

  // Load now and refresh every minute while the page is open
  useEffect(() => {
    const first = window.setTimeout(load, 0);
    const timer = window.setInterval(load, REFRESH_MS);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [load]);

  const unread = items.filter((item) => !seen.includes(item.id)).length;

  function markAllRead() {
    const next = Array.from(new Set([...seen, ...items.map((item) => item.id)]));
    setSeen(next);
    saveSeen(next);
  }

  function markRead(id: string) {
    if (seen.includes(id)) return;
    const next = [...seen, id];
    setSeen(next);
    saveSeen(next);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
          className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Bell aria-hidden className={cn("size-5", unread > 0 && "origin-top animate-[wiggle_1s_ease-in-out_2]")} />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex min-w-4.5 items-center justify-center rounded-full bg-rose-600 px-1 text-[0.65rem] leading-4.5 font-bold text-white ring-2 ring-background">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <DropdownMenuLabel className="p-0 text-sm font-semibold text-foreground">Notifications</DropdownMenuLabel>
          {unread > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center gap-1 rounded-sm text-xs font-medium text-sand-deep outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <CheckCheck aria-hidden className="size-3.5" /> Mark all read
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        {items.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">You're all caught up 🎉</p>
        ) : (
          <div className="max-h-96 overflow-y-auto p-1.5">
            {items.map((item) => {
              const meta = TYPE_META[item.type] ?? TYPE_META.NewMaterial;
              const isUnread = !seen.includes(item.id);
              return (
                <DropdownMenuItem key={item.id} asChild className="items-start gap-3 rounded-lg px-2.5 py-2.5">
                  <Link to={`/learning/courses/${item.courseId}`} onClick={() => markRead(item.id)}>
                    <span className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full", meta.tone)}>
                      <meta.icon aria-hidden className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold">{item.title}</span>
                        {isUnread && <span className="size-2 shrink-0 rounded-full bg-rose-600" aria-label="unread" />}
                      </span>
                      <span className="block text-sm text-muted-foreground">{item.message}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground/80">
                        {item.courseTitle} · {formatDateTime(item.time)}
                      </span>
                    </span>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationsBell;
