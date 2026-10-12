import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import CoverImage from "@/components/CoverImage";
import { cardImageZoom, cardStyle } from "@/lib/styles";
import type { CareerPath } from "@/types/CareerPath";

type CareerPathCardProps = {
  careerPath: CareerPath;
};

function CareerPathCard({ careerPath }: CareerPathCardProps) {
  return (
    <article className={cardStyle}>
      <CoverImage
        src={careerPath.imageUrl}
        title={careerPath.title}
        className="aspect-[16/9]"
        imageClassName={cardImageZoom}
      />

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl leading-snug font-semibold">
            {/* The ::after layer stretches this link over the whole card, so the card is one click target */}
            <Link
              to={`/career-paths/${careerPath.id}`}
              className="outline-none after:absolute after:inset-0"
            >
              {careerPath.title}
            </Link>
          </h3>
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>

        {careerPath.shortDescription && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {careerPath.shortDescription}
          </p>
        )}

        <p className="mt-auto pt-6 text-xs font-semibold tracking-[0.14em] text-sand-deep uppercase">
          {careerPath.programCount}{" "}
          {careerPath.programCount === 1 ? "program" : "programs"}
        </p>
      </div>
    </article>
  );
}

export default CareerPathCard;
