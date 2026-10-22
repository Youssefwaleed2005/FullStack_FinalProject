import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";

function CtaSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="bg-andalusia-pattern pointer-events-none absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-sand/25 blur-3xl"
        />
        {/* Floating decorative shapes */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-10 left-[8%] hidden size-14 animate-float rounded-2xl border border-sand/40 bg-sand/10 rotate-12 sm:block"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute right-[10%] bottom-12 hidden size-10 animate-float-slow rounded-full border border-sand/40 bg-sand/15 sm:block"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute top-16 right-[18%] hidden size-3 animate-float rounded-full bg-sand sm:block"
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-4xl leading-tight font-semibold text-balance sm:text-5xl">
            Ready to start <span className="text-gradient-sand">learning</span>?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-primary-foreground/75">
            Browse our catalog and enrol in a course today.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-sand px-6 text-base text-primary shadow-lg shadow-sand/20 transition hover:-translate-y-0.5 hover:bg-sand/85 motion-reduce:hover:translate-y-0"
            >
              <Link to="/courses">
                Browse courses
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-primary-foreground/25 bg-transparent px-6 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link to="/contact">Talk to us</Link>
            </Button>
          </div>
          <p className="mt-7 text-sm text-primary-foreground/60">
            Questions? Write to{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="rounded-sm font-medium text-sand underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-sand/60"
            >
              {site.contact.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
