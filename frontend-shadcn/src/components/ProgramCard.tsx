import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, CalendarDays, Clock } from "lucide-react";
import CoverImage from "@/components/CoverImage";
import StatusPill from "@/components/StatusPill";
import { STATUS_META, formatDate, formatPrice } from "@/lib/course";
import { cardImageZoom, cardStyle } from "@/lib/styles";
import type { Program } from "@/types/Program";

type ProgramCardProps = {
  program: Program;
};

function ProgramCard({ program }: ProgramCardProps) {
  return (
    <article className={cardStyle}>
      <div className="relative">
        <CoverImage
          src={program.imageUrl}
          title={program.title}
          className="aspect-[16/10]"
          imageClassName={cardImageZoom}
        />

        <StatusPill
          status={STATUS_META[program.status]}
          className="absolute top-3 left-3 bg-white/95 shadow-sm ring-0 backdrop-blur"
        />

        {program.isFeatured && (
          <span className="absolute top-3 right-3 rounded-full bg-sand px-2.5 py-1 text-xs font-semibold text-primary shadow-sm">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold tracking-[0.14em] text-sand-deep uppercase">
          {program.categoryName}
        </p>

        <h3 className="mt-2 line-clamp-2 text-xl leading-snug font-semibold">
          {/* The ::after layer stretches this link over the whole card, so the card is one click target */}
          <Link
            to={`/programs/${program.id}`}
            className="outline-none after:absolute after:inset-0"
          >
            {program.title}
          </Link>
        </h3>

        {program.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {program.shortDescription}
          </p>
        )}

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <Clock aria-hidden className="size-3.5" />
            {program.durationWeeks} weeks
          </li>
          <li className="flex items-center gap-1.5">
            <BookOpen aria-hidden className="size-3.5" />
            {program.courseCount}{" "}
            {program.courseCount === 1 ? "course" : "courses"}
          </li>
          {program.startDate && (
            <li className="flex items-center gap-1.5">
              <CalendarDays aria-hidden className="size-3.5" />
              Starts {formatDate(program.startDate)}
            </li>
          )}
        </ul>

        <div className="mt-auto flex items-center justify-end gap-2 pt-5">
          <span className="text-base font-semibold text-foreground">
            {formatPrice(program.price)}
          </span>
          <span
            aria-hidden
            className="flex size-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </article>
  );
}

export default ProgramCard;
