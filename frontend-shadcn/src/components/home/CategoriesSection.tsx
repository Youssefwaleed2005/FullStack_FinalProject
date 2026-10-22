import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Briefcase,
  ChartColumn,
  CodeXml,
  Megaphone,
  Palette,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiData } from "@/hooks/useApiData";
import { getCategories } from "@/services/categoryService";

// Picks an icon from a keyword in the category name
function iconFor(name: string): LucideIcon {
  const lower = name.toLowerCase();
  if (lower.includes("web") || lower.includes("develop") || lower.includes("program"))
    return CodeXml;
  if (lower.includes("data") || lower.includes("analy")) return ChartColumn;
  if (lower.includes("business") || lower.includes("manage")) return Briefcase;
  if (lower.includes("design")) return Palette;
  if (lower.includes("market")) return Megaphone;
  return Sparkles;
}

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
              <Skeleton className="h-48 rounded-2xl" />
            </li>
          ))}

        {categories.map((category, index) => {
          const Icon = iconFor(category.name);
          return (
            <li
              key={category.id}
              className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <Link
                to={`/courses?category=${category.id}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition duration-300 outline-none hover:-translate-y-1 hover:border-sand/70 hover:shadow-xl hover:shadow-primary/10 focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {/* Soft glow that grows on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-sand/20 blur-2xl transition-transform duration-500 group-hover:scale-150"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 -bottom-6 font-heading text-8xl font-semibold text-sand/15 transition-colors duration-300 group-hover:text-sand/25"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative flex items-start justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/75 text-primary-foreground shadow-md shadow-primary/20 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transform-none">
                    <Icon className="size-6" />
                  </span>
                  <span
                    aria-hidden
                    className="flex size-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-all duration-300 group-hover:rotate-45 group-hover:bg-sand group-hover:text-primary"
                  >
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
                <h3 className="relative mt-6 text-xl font-semibold">{category.name}</h3>
                {category.description && (
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                )}
                <span className="relative mt-auto pt-5 text-sm font-medium text-sand-deep opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Explore courses →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default CategoriesSection;
