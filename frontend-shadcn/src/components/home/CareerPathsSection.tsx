import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiData } from "@/hooks/useApiData";
import { getCareerPaths } from "@/services/careerPathService";

function loadFeaturedCareerPaths() {
  return getCareerPaths({ isFeatured: true, take: 3 });
}

function CareerPathsSection() {
  const { data, loading } = useApiData(loadFeaturedCareerPaths);
  const careerPaths = data ?? [];

  // Nothing to show (or the request failed): leave the section out of the page
  if (!loading && careerPaths.length === 0) return null;

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          tone="light"
          eyebrow="Career paths"
          title="Know where you are heading"
          description="Each path lines up the programs you need to reach a specific role."
          action={
            <Button
              asChild
              size="lg"
              className="rounded-full bg-sand px-4 text-primary hover:bg-sand/85"
            >
              <Link to="/career-paths">
                All career paths
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          }
        />

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            Array.from({ length: 3 }, (_, index) => (
              <li key={index}>
                <Skeleton className="h-48 rounded-2xl bg-primary-foreground/10" />
              </li>
            ))}

          {careerPaths.map((careerPath) => (
            <li key={careerPath.id}>
              <Link
                to={`/career-paths/${careerPath.id}`}
                className="group flex h-full flex-col rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 transition duration-300 outline-none hover:-translate-y-1 hover:border-sand/60 hover:bg-primary-foreground/10 focus-visible:ring-3 focus-visible:ring-sand/60 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl leading-snug font-semibold">
                    {careerPath.title}
                  </h3>
                  <span
                    aria-hidden
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors duration-300 group-hover:bg-sand group-hover:text-primary"
                  >
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
                {careerPath.shortDescription && (
                  <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
                    {careerPath.shortDescription}
                  </p>
                )}
                {careerPath.programCount > 0 && (
                  <p className="mt-auto pt-6 text-xs font-semibold tracking-[0.14em] text-sand uppercase">
                    {careerPath.programCount}{" "}
                    {careerPath.programCount === 1 ? "program" : "programs"}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default CareerPathsSection;
