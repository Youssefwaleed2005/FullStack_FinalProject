import { Link } from "react-router-dom";
import { ArrowRight, Clock, Compass, Flag, MapPin, MonitorPlay, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { topicFor } from "@/lib/topics";
import { cn } from "@/lib/utils";
import type { CareerPathDetails } from "@/types/CareerPath";

// Steps shown in the hero; the rest are summed up under the list
const MAX_STEPS = 4;

const eyebrowStyle = "text-xs font-semibold tracking-[0.18em] text-sand uppercase";

// Same look as the hero's floating cards
const stepCard = "rounded-2xl bg-card/95 shadow-lg shadow-primary/20 backdrop-blur";

// Room for 4 steps, so the arch keeps its height when a path has fewer courses
const listHeight = "min-h-72";

const sandLink =
  "inline-flex items-center gap-1.5 rounded-sm text-sm font-medium outline-none hover:underline focus-visible:ring-3 focus-visible:ring-sand/60";

type CareerRoadmapProps = {
  // The path the hero's rotating word is on; null when the API had none (or failed)
  path: CareerPathDetails | null;
  loading: boolean;
};

// The courses of the active career path as numbered steps, inside the hero's arch
function CareerRoadmap({ path, loading }: CareerRoadmapProps) {
  if (loading) return <RoadmapSkeleton />;
  if (!path || path.recommendedCourses.length === 0) return <RoadmapFallback path={path} />;

  const steps = path.recommendedCourses.slice(0, MAX_STEPS);
  const more = path.recommendedCourses.length - steps.length;
  const totalHours = path.recommendedCourses.reduce((sum, course) => sum + course.durationHours, 0);

  return (
    // A new key per path remounts the steps, so they play the same entrance as the gold word
    <div key={path.id} className="relative">
      <p className={eyebrowStyle}>Your roadmap</p>
      <h2 className="mt-1 animate-word truncate font-heading text-2xl font-semibold text-primary-foreground">
        {path.title}
      </h2>
      <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-primary-foreground/75">
        <span className="inline-flex items-center gap-1">
          <Flag aria-hidden className="size-3.5 text-sand" />
          {path.recommendedCourses.length} {path.recommendedCourses.length === 1 ? "course" : "courses"}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock aria-hidden className="size-3.5 text-sand" />
          {totalHours} hours in total
        </span>
        <span className="inline-flex items-center gap-1">
          <Trophy aria-hidden className="size-3.5 text-sand" />
          Job-ready
        </span>
      </p>

      <ol aria-label={`${path.title}: courses in order`} className={cn("mt-5 flex flex-col gap-3", listHeight)}>
        {steps.map((course, index) => {
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;
          const topic = topicFor(course.title);
          const TypeIcon = course.type === "Online" ? MonitorPlay : MapPin;
          return (
            <li
              key={course.id}
              style={{ animationDelay: `${index * 90}ms` }}
              className="relative flex animate-word items-center gap-3"
            >
              {/* Line down to the next step's number */}
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute top-1/2 left-4.5 h-[calc(100%+0.75rem)] w-0.5 -translate-x-1/2 rounded-full bg-linear-to-b from-sand to-sand/20"
                />
              )}
              <span
                aria-hidden
                className={cn(
                  "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  isFirst
                    ? "bg-sand text-primary shadow-md shadow-sand/40"
                    : "bg-primary text-primary-foreground ring-1 ring-sand/50",
                )}
              >
                {/* Soft pulse around the first step */}
                {isFirst && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-sand/40 [animation-duration:2.5s] motion-reduce:hidden" />
                )}
                <span className="relative">{index + 1}</span>
              </span>
              <Link
                to={`/courses/${course.id}`}
                className={cn(
                  stepCard,
                  "group/step flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 outline-none transition duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-3 focus-visible:ring-sand/60 motion-reduce:hover:translate-y-0",
                  isFirst && "ring-2 ring-sand",
                )}
              >
                {/* Course icon, coloured by topic (SQL, Python, React…) */}
                <span
                  aria-hidden
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover/step:-rotate-6 group-hover/step:scale-110 motion-reduce:transform-none",
                    topic.soft,
                  )}
                >
                  <topic.icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="sr-only">Step {index + 1}: </span>
                  <span className="block truncate text-sm font-semibold text-foreground">{course.title}</span>
                  <span className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock aria-hidden className="size-3.5 shrink-0" />
                      {course.durationHours} hours
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <TypeIcon aria-hidden className="size-3.5 shrink-0" />
                      {course.type === "Online" ? "Online" : "On campus"}
                    </span>
                  </span>
                </span>
                {isFirst && (
                  <span className="hidden shrink-0 rounded-full bg-sand px-2.5 py-1 text-[0.65rem] font-bold tracking-wide text-primary uppercase shadow-sm sm:inline">
                    Start here
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>

      {/* Solid sand pill: plain sand text was too faint on the lighter bottom of the arch */}
      <Link
        to={`/career-paths/${path.id}`}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-sand px-4 py-2 text-sm font-semibold text-primary shadow-md shadow-primary/30 outline-none transition hover:-translate-y-0.5 hover:bg-sand/85 focus-visible:ring-3 focus-visible:ring-sand/60 motion-reduce:hover:translate-y-0"
      >
        {more > 0 ? `+${more} more ${more === 1 ? "course" : "courses"} · see the full path` : "See the full path"}
        <ArrowRight aria-hidden className="size-4" />
      </Link>
    </div>
  );
}

// Same shape as the roadmap, while the paths load
function RoadmapSkeleton() {
  return (
    <div aria-busy className="relative">
      <span className="sr-only">Loading career paths…</span>
      <Skeleton className="h-3 w-24 bg-primary-foreground/15" />
      <Skeleton className="mt-2.5 h-7 w-52 bg-primary-foreground/15" />
      <div className={cn("mt-5 flex flex-col gap-3", listHeight)}>
        {Array.from({ length: MAX_STEPS }, (_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="size-9 shrink-0 rounded-full bg-primary-foreground/15" />
            <div className={cn(stepCard, "flex-1 px-4 py-3")}>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="mt-2 h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="mt-4 h-4 w-32 bg-primary-foreground/15" />
    </div>
  );
}

// No paths (or the API is down), or a path without courses yet: point to the career paths page
function RoadmapFallback({ path }: { path: CareerPathDetails | null }) {
  return (
    <div className="relative">
      <p className={eyebrowStyle}>Career paths</p>
      <h2 className="mt-1 truncate font-heading text-2xl font-semibold text-primary-foreground">
        {path ? path.title : "Find your path"}
      </h2>
      <div className={cn("mt-5 flex flex-col justify-center", listHeight)}>
        <div className={cn(stepCard, "flex items-start gap-4 p-5")}>
          <span
            aria-hidden
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-sand-deep"
          >
            <Compass className="size-5" strokeWidth={1.75} />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground">
              {path ? "Roadmap coming soon" : "Guided career paths"}
            </span>
            <span className="block text-sm text-muted-foreground">
              {path ? "The courses for this path are being prepared." : "A clear route from beginner to hired."}
            </span>
            <Link to={path ? `/career-paths/${path.id}` : "/career-paths"} className={cn(sandLink, "mt-2 text-sand-deep")}>
              Browse career paths
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default CareerRoadmap;
