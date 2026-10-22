import { BookOpen, Layers, Route, Shapes } from "lucide-react";
import CountUp from "@/components/fun/CountUp";
import { useApiData } from "@/hooks/useApiData";
import { useInView } from "@/hooks/useInView";
import { getCareerPaths } from "@/services/careerPathService";
import { getCategories } from "@/services/categoryService";
import { getCourses } from "@/services/courseService";
import { getPrograms } from "@/services/programService";

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

  const stats = [
    { label: "Courses", value: data.courses, icon: BookOpen },
    { label: "Programs", value: data.programs, icon: Layers },
    { label: "Career paths", value: data.careerPaths, icon: Route },
    { label: "Fields to explore", value: data.categories, icon: Shapes },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        ref={ref}
        className="relative -mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border/80 bg-border/80 shadow-xl shadow-primary/5 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group flex flex-col items-center gap-2 bg-card px-4 py-8 text-center transition-colors duration-300 hover:bg-secondary/60"
          >
            <span className="flex size-11 items-center justify-center rounded-2xl bg-sand/15 text-sand-deep transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-6 motion-reduce:transform-none">
              <stat.icon className="size-5" />
            </span>
            <span className="font-heading text-4xl font-semibold text-primary sm:text-5xl">
              {inView ? <CountUp value={stat.value} suffix="+" /> : "0+"}
            </span>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsSection;
