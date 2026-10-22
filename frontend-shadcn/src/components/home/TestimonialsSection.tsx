import { Quote } from "lucide-react";
import Avatar from "@/components/Avatar";
import SectionHeading from "@/components/SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiData } from "@/hooks/useApiData";
import { cn } from "@/lib/utils";
import { getTestimonials } from "@/services/testimonialService";

function loadTestimonials() {
  return getTestimonials(3);
}

function TestimonialsSection() {
  const { data, loading } = useApiData(loadTestimonials);
  const testimonials = data ?? [];

  // Nothing to show (or the request failed): leave the section out of the page
  if (!loading && testimonials.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-sand/10 blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading eyebrow="Testimonials" title="What our students say" />

        <ul className="grid items-center gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading &&
            Array.from({ length: 3 }, (_, index) => (
              <li key={index}>
                <Skeleton className="h-56 rounded-2xl" />
              </li>
            ))}

          {testimonials.map((testimonial, index) => {
            // The middle card is raised and dark to break the row up
            const featured = testimonials.length === 3 && index === 1;
            return (
              <li
                key={testimonial.id}
                className="animate-in fade-in zoom-in-95 fill-mode-both duration-700"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <figure
                  className={cn(
                    "relative flex h-full flex-col overflow-hidden rounded-2xl border p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:hover:translate-y-0",
                    featured
                      ? "border-primary bg-primary text-primary-foreground shadow-xl shadow-primary/20 lg:-my-4 lg:py-10"
                      : "border-border/80 bg-card shadow-xs hover:shadow-primary/10",
                  )}
                >
                  {featured && (
                    <span
                      aria-hidden
                      className="bg-andalusia-pattern pointer-events-none absolute inset-0 opacity-15"
                    />
                  )}
                  <Quote
                    aria-hidden
                    className="relative size-9 fill-sand/40 text-sand"
                    strokeWidth={1.5}
                  />
                  <blockquote
                    className={cn(
                      "relative mt-5 text-base leading-relaxed",
                      featured ? "text-primary-foreground/90" : "text-foreground",
                    )}
                  >
                    {testimonial.content}
                  </blockquote>
                  <figcaption className="relative mt-auto flex items-center gap-3 pt-7">
                    <Avatar
                      name={testimonial.authorName}
                      photoUrl={testimonial.photoUrl}
                      className="size-11 text-sm ring-2 ring-sand/60"
                    />
                    <span>
                      <span className="block text-sm font-semibold">
                        {testimonial.authorName}
                      </span>
                      {testimonial.authorTitle && (
                        <span
                          className={cn(
                            "block text-sm",
                            featured
                              ? "text-primary-foreground/65"
                              : "text-muted-foreground",
                          )}
                        >
                          {testimonial.authorTitle}
                        </span>
                      )}
                    </span>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default TestimonialsSection;
