import { Quote } from "lucide-react";
import Avatar from "@/components/Avatar";
import SectionHeading from "@/components/SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiData } from "@/hooks/useApiData";
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
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <SectionHeading
        eyebrow="Testimonials"
        title="What our students say"
      />

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 3 }, (_, index) => (
            <li key={index}>
              <Skeleton className="h-56 rounded-2xl" />
            </li>
          ))}

        {testimonials.map((testimonial) => (
          <li key={testimonial.id}>
            <figure className="flex h-full flex-col rounded-2xl border border-border/80 bg-card p-7 shadow-xs">
              <Quote
                aria-hidden
                className="size-8 fill-sand/40 text-sand"
                strokeWidth={1.5}
              />
              <blockquote className="mt-5 text-base leading-relaxed text-foreground">
                {testimonial.content}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-7">
                <Avatar
                  name={testimonial.authorName}
                  photoUrl={testimonial.photoUrl}
                  className="size-11 text-sm"
                />
                <span>
                  <span className="block text-sm font-semibold">
                    {testimonial.authorName}
                  </span>
                  {testimonial.authorTitle && (
                    <span className="block text-sm text-muted-foreground">
                      {testimonial.authorTitle}
                    </span>
                  )}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TestimonialsSection;
