import { Link } from "react-router-dom";
import { ArrowRight, Compass, GraduationCap, MonitorPlay } from "lucide-react";
import { Button } from "@/components/ui/button";

const HIGHLIGHTS = [
  {
    icon: GraduationCap,
    title: "Taught by practitioners",
    text: "Instructors who do the job every day",
  },
  {
    icon: MonitorPlay,
    title: "Online or on campus",
    text: "Pick the format that fits your week",
  },
  {
    icon: Compass,
    title: "Guided career paths",
    text: "A clear route from beginner to hired",
  },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-linear-to-b from-secondary/70 to-background">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 size-112 rounded-full bg-sand/20 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-sand/60 bg-card/70 px-3.5 py-1.5 text-xs font-semibold tracking-[0.14em] text-sand-deep uppercase backdrop-blur">
            <span aria-hidden className="size-1.5 rounded-full bg-sand-deep" />
            Courses · Programs · Career paths
          </p>

          <h1 className="mt-6 text-5xl leading-[1.05] font-semibold text-balance sm:text-6xl lg:text-7xl">
            Learn without <span className="text-sand-deep italic">limits</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Explore courses, programs and career paths taught by industry
            experts — and build the skills employers are hiring for.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 rounded-full px-6 text-base">
              <Link to="/courses">
                Explore courses
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full bg-card px-6 text-base"
            >
              <Link to="/career-paths">View career paths</Link>
            </Button>
          </div>
        </div>

        {/* Decorative arch panel — a nod to Andalusian architecture */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative overflow-hidden rounded-t-[14rem] rounded-b-3xl bg-linear-to-b from-primary via-[#553b23] to-[#7a5632] px-6 pt-28 pb-6 shadow-2xl shadow-primary/25 sm:px-8 sm:pt-36 sm:pb-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-8 top-8 h-full rounded-t-[12rem] border border-sand/25"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 left-1/2 size-64 -translate-x-1/2 rounded-full bg-sand/25 blur-3xl"
            />

            <ul className="relative space-y-3">
              {HIGHLIGHTS.map((highlight) => (
                <li
                  key={highlight.title}
                  className="flex items-center gap-4 rounded-2xl bg-white/95 p-4 shadow-lg shadow-primary/20 backdrop-blur"
                >
                  <span
                    aria-hidden
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-sand-deep"
                  >
                    <highlight.icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">
                      {highlight.title}
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      {highlight.text}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
