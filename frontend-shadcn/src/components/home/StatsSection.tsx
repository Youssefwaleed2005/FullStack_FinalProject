import { BookOpen, Layers, Route, Shapes } from "lucide-react";
import CountUp from "@/components/fun/CountUp";
import { useApiData } from "@/hooks/useApiData";
import { useInView } from "@/hooks/useInView";
import { getCareerPaths } from "@/services/careerPathService";
import { getCategories } from "@/services/categoryService";
import { getCourses } from "@/services/courseService";
import { getPrograms } from "@/services/programService";
import { cn } from "@/lib/utils";

type Stats = {
  courses: number;
  programs: number;
  careerPaths: number;
  categories: number;
};

// Real numbers from the API (pageSize 1 is enough to read totalCount)
async function loadStats(): Promise<Stats> {
  const [courses, programs, careerPaths, categories] = await Promise.all([
    getCourses({ pageSize: 1 }),
    getPrograms({ pageSize: 1 }),
    getCareerPaths(),
    getCategories(),
  ]);
  return {
    courses: courses.totalCount,
    programs: programs.totalCount,
    careerPaths: careerPaths.length,
    categories: categories.length,
  };
}

function StatsSection() {
  const { data } = useApiData(loadStats);

  if (!data) return null;

  // Only mount the grid once the data exists, so the in-view observer has an element to watch
  return <StatsGrid data={data} />;
}

function StatsGrid({ data }: { data: Stats }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);

  // Each stat gets its own colour: icon tile, glow, number and underline
  const stats = [
    {
      label: "Courses",
      note: "Hands-on, project based",
      value: data.courses,
      icon: BookOpen,
      tile: "from-sky-400 to-blue-600 shadow-blue-500/30",
      glow: "bg-sky-400/25",
      text: "text-blue-700 dark:text-sky-300",
      bar: "from-sky-400 to-blue-600",
    },
    {
      label: "Programs",
      note: "Courses bundled into tracks",
      value: data.programs,
      icon: Layers,
      tile: "from-violet-400 to-purple-600 shadow-purple-500/30",
      glow: "bg-violet-400/25",
      text: "text-purple-700 dark:text-violet-300",
      bar: "from-violet-400 to-purple-600",
    },
    {
      label: "Career paths",
      note: "Step-by-step roadmaps",
      value: data.careerPaths,
      icon: Route,
      tile: "from-emerald-400 to-teal-600 shadow-teal-500/30",
      glow: "bg-emerald-400/25",
      text: "text-teal-700 dark:text-emerald-300",
      bar: "from-emerald-400 to-teal-600",
    },
    {
      label: "Fields to explore",
      note: "From data to design",
      value: data.categories,
      icon: Shapes,
      tile: "from-amber-400 to-orange-600 shadow-orange-500/30",
      glow: "bg-amber-400/25",
      text: "text-orange-700 dark:text-amber-300",
      bar: "from-amber-400 to-orange-600",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        ref={ref}
        className="relative -mt-6 grid grid-cols-2 gap-3 rounded-[2rem] border border-border/80 bg-card/80 p-3 shadow-xl shadow-primary/5 backdrop-blur sm:gap-4 sm:p-4 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            style={{ transitionDelay: `${index * 90}ms` }}
            className={cn(
              "group relative flex flex-col items-center overflow-hidden rounded-3xl border border-border/60 bg-card px-4 pt-7 pb-6 text-center transition duration-500 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
          >
            {/* soft coloured glow + faint pattern behind the icon */}
            <div aria-hidden className={cn("absolute -top-10 left-1/2 size-36 -translate-x-1/2 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125", stat.glow)} />
            <div aria-hidden className="bg-andalusia-pattern pointer-events-none absolute inset-0 opacity-[0.07]" />

            <span
              className={cn(
                "relative flex size-14 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-6 motion-reduce:transform-none",
                stat.tile,
              )}
            >
              <stat.icon aria-hidden className="size-6" strokeWidth={2} />
            </span>

            <span className={cn("relative mt-4 flex items-start font-heading text-5xl leading-none font-semibold sm:text-6xl", stat.text)}>
              {inView ? <CountUp value={stat.value} /> : 0}
              <span className="mt-1 ml-0.5 text-2xl sm:text-3xl">+</span>
            </span>
            <span className="relative mt-2 text-base font-semibold text-foreground">{stat.label}</span>
            <span className="relative mt-0.5 text-xs text-muted-foreground">{stat.note}</span>
            <span
              aria-hidden
              className={cn("relative mt-4 h-1 w-10 rounded-full bg-linear-to-r transition-all duration-500 group-hover:w-20", stat.bar)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsSection;
