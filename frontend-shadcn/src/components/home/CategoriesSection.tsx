import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiData } from "@/hooks/useApiData";
import { getCategories } from "@/services/categoryService";

function CategoriesSection() {
  const { data, loading } = useApiData(getCategories);
  const categories = (data ?? []).filter((category) => category.isFeatured);

  // Nothing to show (or the request failed): leave the section out of the page
  if (!loading && categories.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <SectionHeading
        eyebrow="Categories"
        title="Find your field"
        description="Start with the area you are curious about and explore every course in it."
      />

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 3 }, (_, index) => (
            <li key={index}>
              <Skeleton className="h-44 rounded-2xl" />
            </li>
          ))}

        {categories.map((category, index) => (
          <li key={category.id}>
            <Link
              to={`/courses?category=${category.id}`}
              className="group flex h-full flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition duration-300 outline-none hover:-translate-y-1 hover:border-sand/70 hover:shadow-xl hover:shadow-primary/10 focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div className="flex items-start justify-between">
                <span
                  aria-hidden
                  className="font-heading text-4xl font-semibold text-sand"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden
                  className="flex size-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold">{category.name}</h3>
              {category.description && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default CategoriesSection;
