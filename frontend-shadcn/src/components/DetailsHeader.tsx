import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import CoverImage from "@/components/CoverImage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { pageContainer } from "@/lib/styles";
import { cn } from "@/lib/utils";

type DetailsHeaderProps = {
  // The list page this item belongs to, e.g. { label: "Courses", to: "/courses" }
  parent: { label: string; to: string };
  title: string;
  description: string | null;
  // Pills shown above the title (category, status…)
  badges?: ReactNode;
  // Leave out to show a header without a cover picture
  image?: { src: string | null };
};

// Top of a details page: breadcrumb, title, short description and cover image
function DetailsHeader({
  parent,
  title,
  description,
  badges,
  image,
}: DetailsHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-linear-to-b from-secondary/70 to-background">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 size-96 rounded-full bg-sand/25 blur-3xl"
      />
      <div
        className={cn(
          pageContainer,
          "relative grid items-center gap-10 py-10 sm:py-14",
          image && "lg:grid-cols-[1.1fr_0.9fr]",
        )}
      >
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={parent.to}>{parent.label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {badges && (
            <div className="mt-6 flex flex-wrap items-center gap-2">{badges}</div>
          )}

          <h1 className="mt-4 text-4xl leading-tight font-semibold text-balance sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
        </div>

        {image && (
          <CoverImage
            src={image.src}
            title={title}
            className="aspect-[16/10] rounded-3xl shadow-2xl shadow-primary/15"
            letterClassName="text-9xl"
          />
        )}
      </div>
    </section>
  );
}

export default DetailsHeader;
