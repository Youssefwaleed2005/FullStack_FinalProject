import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Atom,
  Braces,
  Briefcase,
  ChartColumn,
  ChartPie,
  CodeXml,
  Database,
  Layers,
  Megaphone,
  MousePointerClick,
  Palette,
  PenTool,
  Search,
  Server,
  Share2,
  Sparkles,
  SquareTerminal,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiData } from "@/hooks/useApiData";
import { cn } from "@/lib/utils";
import { getCategories } from "@/services/categoryService";

type Tool = { label: string; icon: LucideIcon };

// Look of each field: its icon, colours, and a few things you learn in it
type FieldTheme = {
  icon: LucideIcon;
  tile: string; // icon tile (gradient)
  glow: string; // soft light in the corner
  chip: string; // small "what you learn" chips
  number: string; // big faded number
  tools: Tool[];
};

const FIELDS: { match: RegExp; theme: FieldTheme }[] = [
  {
    match: /web|develop|program|software/i,
    theme: {
      icon: CodeXml,
      tile: "from-sky-500 to-blue-700 shadow-sky-500/30",
      glow: "bg-sky-400/25",
      chip: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
      number: "text-sky-500/15 group-hover:text-sky-500/25",
      tools: [
        { label: "React", icon: Atom },
        { label: "ASP.NET", icon: Server },
        { label: "APIs", icon: Braces },
      ],
    },
  },
  {
    match: /data|analy|science/i,
    theme: {
      icon: ChartColumn,
      tile: "from-teal-500 to-emerald-700 shadow-teal-500/30",
      glow: "bg-teal-400/25",
      chip: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
      number: "text-teal-500/15 group-hover:text-teal-500/25",
      tools: [
        { label: "SQL", icon: Database },
        { label: "Python", icon: SquareTerminal },
        { label: "Power BI", icon: ChartPie },
      ],
    },
  },
  {
    match: /design|ui|ux/i,
    theme: {
      icon: Palette,
      tile: "from-rose-500 to-fuchsia-700 shadow-rose-500/30",
      glow: "bg-rose-400/25",
      chip: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
      number: "text-rose-500/15 group-hover:text-rose-500/25",
      tools: [
        { label: "UI design", icon: PenTool },
        { label: "UX", icon: MousePointerClick },
        { label: "Prototypes", icon: Layers },
      ],
    },
  },
  {
    match: /market/i,
    theme: {
      icon: Megaphone,
      tile: "from-orange-500 to-red-600 shadow-orange-500/30",
      glow: "bg-orange-400/25",
      chip: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
      number: "text-orange-500/15 group-hover:text-orange-500/25",
      tools: [
        { label: "SEO", icon: Search },
        { label: "Social media", icon: Share2 },
        { label: "Campaigns", icon: Target },
      ],
    },
  },
  {
    match: /business|manage/i,
    theme: {
      icon: Briefcase,
      tile: "from-violet-500 to-indigo-700 shadow-violet-500/30",
      glow: "bg-violet-400/25",
      chip: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
      number: "text-violet-500/15 group-hover:text-violet-500/25",
      tools: [
        { label: "Management", icon: Users },
        { label: "Marketing", icon: Megaphone },
        { label: "Strategy", icon: Target },
      ],
    },
  },
];

const DEFAULT_THEME: FieldTheme = {
  icon: Sparkles,
  tile: "from-primary to-primary/75 shadow-primary/20",
  glow: "bg-sand/20",
  chip: "bg-sand/15 text-sand-deep",
  number: "text-sand/15 group-hover:text-sand/25",
  tools: [],
};

// Picks the look from keywords in the category name
function themeFor(name: string): FieldTheme {
  return FIELDS.find((field) => field.match.test(name))?.theme ?? DEFAULT_THEME;
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
          const theme = themeFor(category.name);
          const Icon = theme.icon;
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
                  className={cn(
                    "pointer-events-none absolute -top-16 -right-16 size-40 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-150",
                    theme.glow,
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute -right-2 -bottom-6 font-heading text-8xl font-semibold transition-colors duration-300",
                    theme.number,
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative flex items-start justify-between">
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-12 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transform-none",
                      theme.tile,
                    )}
                  >
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
                {theme.tools.length > 0 && (
                  <ul aria-label={`Topics in ${category.name}`} className="relative mt-4 flex flex-wrap gap-1.5">
                    {theme.tools.map((tool) => (
                      <li
                        key={tool.label}
                        className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", theme.chip)}
                      >
                        <tool.icon aria-hidden className="size-3.5" />
                        {tool.label}
                      </li>
                    ))}
                  </ul>
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
