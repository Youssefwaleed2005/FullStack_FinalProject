import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  MapPin,
  MonitorPlay,
} from "lucide-react";
import Avatar from "@/components/Avatar";
import { STATUS_META, formatDate, formatPrice } from "@/lib/course";
import type { Course } from "@/types/Course";

type CourseCardProps = {
  course: Course;
};

function CourseCard({ course }: CourseCardProps) {
  // If the image is missing or fails to load we show a branded placeholder instead
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = course.imageUrl !== null && !imageFailed;
  const status = STATUS_META[course.status];
  const isOnline = course.type === "Online";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition duration-300 ease-out focus-within:ring-3 focus-within:ring-ring/50 hover:-translate-y-1 hover:border-sand/70 hover:shadow-xl hover:shadow-primary/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {showImage ? (
          <img
            src={course.imageUrl ?? undefined}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="size-full object-cover transition duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div
            aria-hidden
            className="flex size-full items-center justify-center bg-linear-to-br from-primary via-[#5a3f26] to-[#7a5632]"
          >
            <span className="font-heading text-7xl font-semibold text-sand/40">
              {course.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
          <span aria-hidden className={`size-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>

        {course.isFeatured && (
          <span className="absolute top-3 right-3 rounded-full bg-sand px-2.5 py-1 text-xs font-semibold text-primary shadow-sm">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold tracking-[0.14em] text-sand-deep uppercase">
          {course.categoryName}
        </p>

        <h3 className="mt-2 line-clamp-2 text-xl leading-snug font-semibold">
          {/* The ::after layer stretches this link over the whole card, so the card is one click target */}
          <Link
            to={`/courses/${course.id}`}
            className="outline-none after:absolute after:inset-0"
          >
            {course.title}
          </Link>
        </h3>

        {course.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {course.shortDescription}
          </p>
        )}

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <Clock aria-hidden className="size-3.5" />
            {course.durationHours} hours
          </li>
          <li className="flex items-center gap-1.5">
            {isOnline ? (
              <MonitorPlay aria-hidden className="size-3.5" />
            ) : (
              <MapPin aria-hidden className="size-3.5" />
            )}
            {isOnline ? "Online" : (course.location ?? "On campus")}
          </li>
          {course.startDate && (
            <li className="flex items-center gap-1.5">
              <CalendarDays aria-hidden className="size-3.5" />
              Starts {formatDate(course.startDate)}
            </li>
          )}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          {course.instructorName ? (
            <div className="flex min-w-0 items-center gap-2.5">
              <Avatar name={course.instructorName} />
              <span className="truncate text-sm text-muted-foreground">
                {course.instructorName}
              </span>
            </div>
          ) : (
            <span />
          )}

          <div className="flex shrink-0 items-center gap-2">
            <span className="text-base font-semibold text-foreground">
              {formatPrice(course.price)}
            </span>
            <span
              aria-hidden
              className="flex size-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
            >
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;
