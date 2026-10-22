import { Compass, CreditCard, MonitorPlay, Trophy } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const STEPS = [
  {
    title: "Explore",
    text: "Browse courses, programs and career paths and pick what fits your goals.",
    icon: Compass,
  },
  {
    title: "Enroll",
    text: "Apply online and pay securely in a couple of minutes.",
    icon: CreditCard,
  },
  {
    title: "Learn",
    text: "Join sessions, open materials and submit assignments from your dashboard.",
    icon: MonitorPlay,
  },
  {
    title: "Grow",
    text: "Track your progress, earn badges and finish job-ready.",
    icon: Trophy,
  },
];

function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden bg-secondary/40">
      <div
        aria-hidden
        className="bg-andalusia-pattern pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="Four steps to your next skill"
          description="From your first click to your final certificate, everything happens in one place."
        />

        <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Dashed line that connects the steps on large screens */}
          <span
            aria-hidden
            className="absolute top-8 right-[12%] left-[12%] hidden border-t-2 border-dashed border-sand/50 lg:block"
          />
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="group relative flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <span className="relative flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105 motion-reduce:transform-none">
                <step.icon className="size-7" />
                <span className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-sand text-xs font-bold text-primary ring-4 ring-background">
                  {index + 1}
                </span>
              </span>
              <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 max-w-60 text-sm leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default HowItWorksSection;
