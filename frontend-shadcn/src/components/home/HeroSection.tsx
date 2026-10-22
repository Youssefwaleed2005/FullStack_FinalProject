import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CircleCheck,
  Compass,
  GraduationCap,
  MonitorPlay,
  Trophy,
} from "lucide-react";
import RotatingWord from "@/components/home/RotatingWord";
import { Button } from "@/components/ui/button";

const ROLES = [
  "full-stack developer",
  "data analyst",
  "UI/UX designer",
  "project manager",
  "digital marketer",
];

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

const PROMISES = ["Expert instructors", "Flexible schedules", "Career guidance"];

function HeroSection() {
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
            <RotatingWord words={ROLES} />
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
                <CircleCheck aria-hidden className="size-4 text-emerald-600" />
                {promise}
              </li>
            ))}
          </ul>
        </div>

        {/* Arch panel — a nod to Andalusian architecture — with floating cards around it */}
        <div className="relative mx-auto w-full max-w-md duration-1000 animate-in fade-in zoom-in-95 motion-reduce:animate-none lg:max-w-none">
          <div className="relative overflow-hidden rounded-t-[14rem] rounded-b-3xl bg-linear-to-b from-primary via-[#553b23] to-[#7a5632] px-6 pt-28 pb-6 shadow-2xl shadow-primary/30 sm:px-8 sm:pt-36 sm:pb-8">
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

            <ul className="relative space-y-3">
              {HIGHLIGHTS.map((highlight, index) => (
                <li
                  key={highlight.title}
                  style={{ animationDelay: `${300 + index * 150}ms` }}
                  className="flex items-center gap-4 rounded-2xl bg-white/95 p-4 shadow-lg shadow-primary/20 backdrop-blur transition duration-300 fill-mode-both animate-in fade-in slide-in-from-right-6 hover:-translate-y-0.5 hover:shadow-xl motion-reduce:animate-none"
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

          {/* Floating cards (decorative, hidden on small screens) */}
          <div
            aria-hidden
            className="absolute -top-4 -left-6 hidden w-56 animate-float rounded-2xl border border-border/80 bg-card/95 p-4 shadow-xl shadow-primary/15 backdrop-blur sm:block lg:-left-12"
          >
            <p className="text-xs font-semibold text-muted-foreground">Your progress</p>
            <p className="mt-1 text-sm font-semibold">React from Scratch</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-3/4 rounded-full bg-linear-to-r from-sand-deep to-sand" />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">75% · keep going! 🚀</p>
          </div>

          <div
            aria-hidden
            className="absolute top-1/2 -right-4 hidden animate-float-slow items-center gap-3 rounded-2xl border border-border/80 bg-card/95 px-4 py-3 shadow-xl shadow-primary/15 backdrop-blur [animation-delay:1.5s] sm:flex lg:-right-10"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-sand text-primary">
              <Trophy className="size-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold">Course complete!</span>
              <span className="block text-xs text-muted-foreground">Badge unlocked 🏅</span>
            </span>
          </div>

          <div
            aria-hidden
            className="absolute -bottom-5 left-6 hidden animate-float items-center gap-3 rounded-2xl border border-border/80 bg-card/95 px-4 py-3 shadow-xl shadow-primary/15 backdrop-blur [animation-delay:3s] sm:flex"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-accent text-sand-deep">
              <CalendarDays className="size-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold">Next session</span>
              <span className="block text-xs text-muted-foreground">Sunday · 6:00 PM</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
