import { useState, type FocusEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CircleCheck } from "lucide-react";
import CareerRoadmap from "@/components/home/CareerRoadmap";
import RotatingWord from "@/components/home/RotatingWord";
import SkillArc from "@/components/home/SkillArc";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/hooks/useApiData";
import { useRotatingIndex } from "@/hooks/useRotatingIndex";
import { getCareerPathRoadmaps } from "@/services/careerPathService";

// Shown while the career paths load, or if there are none / the API is down
const FALLBACK_ROLES = [
  "full-stack developer",
  "data analyst",
  "UI/UX designer",
  "project manager",
  "digital marketer",
];

// How long each career path stays on screen (the gold word and the roadmap change together)
const ROTATE_MS = 2600;

const PROMISES = ["Expert instructors", "Flexible schedules", "Career guidance"];

// "Full-Stack Developer" → "full-stack developer"; acronyms such as "UI/UX" stay as they are
function toRoleWord(title: string) {
  return title
    .split(" ")
    .map((word) => (word === word.toUpperCase() ? word : word.toLowerCase()))
    .join(" ");
}

function HeroSection() {
  const { data: paths, loading } = useApiData(getCareerPathRoadmaps);
  // Hovering or tabbing into the roadmap holds the current path so it can be read and clicked
  const [paused, setPaused] = useState(false);

  const hasPaths = !!paths && paths.length > 0;
  const words = hasPaths ? paths.map((path) => toRoleWord(path.title)) : FALLBACK_ROLES;
  // The only rotation timer: the gold word and the roadmap both read this index
  const index = useRotatingIndex(words.length, ROTATE_MS, paused);
  const activePath = hasPaths ? paths[index] : null;

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
  }

  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-linear-to-b from-secondary/80 via-background to-background">
      {/* Decoration: star pattern + drifting glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-andalusia-pattern opacity-60 mask-[radial-gradient(ellipse_at_top_left,black_10%,transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 size-112 animate-float-slow rounded-full bg-sand/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 size-96 animate-float rounded-full bg-[#c8955c]/15 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="duration-700 animate-in fade-in slide-in-from-bottom-6 motion-reduce:animate-none">
          <p className="inline-flex items-center gap-2 rounded-full border border-sand/60 bg-card/80 px-3.5 py-1.5 text-xs font-semibold tracking-[0.14em] text-sand-deep uppercase shadow-sm backdrop-blur">
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-sand-deep/60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-sand-deep" />
            </span>
            New courses open for enrollment
          </p>

          <h1 className="mt-6 text-5xl leading-[1.05] font-semibold text-balance sm:text-6xl lg:text-7xl">
            Learn without <span className="text-gradient-sand italic">limits</span>
          </h1>

          <p className="mt-5 font-heading text-2xl leading-snug sm:text-3xl">
            Start your journey to becoming a{" "}
            <RotatingWord words={words} index={index} />
          </p>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Explore courses, programs and career paths taught by industry
            experts, and build the skills employers are hiring for.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="group h-12 rounded-full px-6 text-base shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25"
            >
              <Link to="/courses">
                Explore courses
                <ArrowRight
                  data-icon="inline-end"
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full bg-card px-6 text-base transition hover:-translate-y-0.5"
            >
              <Link to="/career-paths">View career paths</Link>
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {PROMISES.map((promise) => (
              <li key={promise} className="flex items-center gap-1.5">
                <CircleCheck aria-hidden className="size-4 text-emerald-600 dark:text-emerald-400" />
                {promise}
              </li>
            ))}
          </ul>
        </div>

        {/* Arch panel — a nod to Andalusian architecture — holding the active career path's roadmap */}
        <div
          className="relative mx-auto w-full max-w-md duration-1000 animate-in fade-in zoom-in-95 motion-reduce:animate-none lg:max-w-none"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={handleBlur}
        >
          <div className="relative overflow-hidden rounded-t-[14rem] rounded-b-3xl bg-linear-to-b from-primary via-[#553b23] to-[#7a5632] px-6 pt-36 pb-6 shadow-2xl shadow-primary/30 sm:px-8 sm:pt-48 sm:pb-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-andalusia-pattern opacity-30"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-8 top-8 h-full rounded-t-[12rem] border border-sand/30"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 left-1/2 size-64 -translate-x-1/2 rounded-full bg-sand/30 blur-3xl"
            />

            {/* New key per path: the chips play their entrance in step with the gold word */}
            <SkillArc key={activePath?.id ?? "none"} skills={activePath?.recommendedSkills ?? null} />

            <CareerRoadmap path={activePath} loading={loading && !paths} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
