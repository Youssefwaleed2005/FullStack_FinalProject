import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  MapPin,
  MonitorPlay,
} from "lucide-react";
import Avatar from "@/components/Avatar";
import CoverImage from "@/components/CoverImage";
import StatusPill from "@/components/StatusPill";
import CompareToggle from "@/components/CompareToggle";
import { StarRating } from "@/components/StarRating";
import WishlistButton from "@/components/WishlistButton";
import { cardImageZoom, cardStyle } from "@/lib/styles";
import { STATUS_META, formatDate, formatPrice } from "@/lib/course";
import type { Course } from "@/types/Course";

type CourseCardProps = {
  course: Course;
};

function CourseCard({ course }: CourseCardProps) {
  const isOnline = course.type === "Online";

  return (
    <article className={cardStyle}>
      <div className="relative">
        <CoverImage
          src={course.imageUrl}
          title={course.title}
          hint={course.categoryName}
          className="aspect-[16/10]"
          imageClassName={cardImageZoom}
        />

        <StatusPill
          status={STATUS_META[course.status]}
          className="absolute top-3 left-3 bg-card/95 shadow-sm ring-0 backdrop-blur"
        />

        {/* Above the card's stretched link, so it can be clicked on its own */}
        <CompareToggle course={course} className="absolute bottom-3 left-3" />
        <WishlistButton course={course} className="absolute right-3 bottom-3" />

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

        {course.reviewCount ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <StarRating value={course.averageRating ?? 0} />
            <span className="font-semibold text-foreground">{course.averageRating?.toFixed(1)}</span>
            ({course.reviewCount})
          </p>
        ) : null}

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
