import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Compass, History, Layers, Target } from "lucide-react";
import Reveal from "@/components/fun/Reveal";
import CtaSection from "@/components/home/CtaSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import PartnersSection from "@/components/home/PartnersSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import { site } from "@/config/site";
import { cardStyle, pageContainer, panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";

const STORY = [
  { title: "Our mission", text: site.about.mission, icon: Target },
  { title: "Our story", text: site.about.story, icon: History },
];

const OFFERS = [
  {
    title: "Courses",
    text: "Focused, hands-on courses that teach one practical skill from start to finish.",
    to: "/courses",
    icon: BookOpen,
  },
  {
    title: "Programs",
    text: "Structured series of courses that take you deeper into a whole field.",
    to: "/programs",
    icon: Layers,
  },
  {
    title: "Career Paths",
    text: "Guided routes of programs and courses that lead to a specific role.",
    to: "/career-paths",
    icon: Compass,
  },
];

function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About us" title={`About ${site.name} ${site.suffix}`} description={site.description} />

      <section aria-label="Mission and story" className={cn(pageContainer, "grid gap-6 py-14 md:grid-cols-2")}>
        {STORY.map((item) => (
          <article key={item.title} className={cn(panelStyle, "p-7 sm:p-8")}>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-sand-deep">
              <item.icon aria-hidden className="size-6" strokeWidth={1.5} />
            </span>
            <h2 className="mt-5 text-2xl font-semibold">{item.title}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{item.text}</p>
          </article>
        ))}
      </section>

      <Reveal>
        <section className={cn(pageContainer, "pb-16 sm:pb-20")}>
          <SectionHeading
            eyebrow="What we offer"
            title="Learn your way"
            description="Start with a single course, or follow a longer route when you know where you want to go."
          />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {OFFERS.map((offer) => (
              <li key={offer.to}>
                <article className={cn(cardStyle, "p-7")}>
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <offer.icon aria-hidden className="size-6" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold">
                    {/* The link covers the whole card */}
                    <Link to={offer.to} className="outline-none after:absolute after:inset-0">
                      {offer.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{offer.text}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-sand-deep">
                    Browse {offer.title.toLowerCase()}
                    <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal>
        <HowItWorksSection />
      </Reveal>
      <Reveal>
        <TestimonialsSection />
      </Reveal>
      <Reveal>
        <PartnersSection />
      </Reveal>
      <Reveal>
        <CtaSection />
      </Reveal>
    </>
  );
}

export default AboutPage;
