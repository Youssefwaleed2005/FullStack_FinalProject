import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import CourseCardSkeleton from "@/components/CourseCardSkeleton";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/hooks/useApiData";
import { getCourses } from "@/services/courseService";

const FEATURED_COUNT = 3;

function loadFeaturedCourses() {
  return getCourses({ isFeatured: true, pageSize: FEATURED_COUNT }).then(
    (page) => page.items,
  );
}

function FeaturedCoursesSection() {
  const { data, loading } = useApiData(loadFeaturedCourses);
  const courses = data ?? [];

  // Nothing to show (or the request failed): leave the section out of the page
  if (!loading && courses.length === 0) return null;

  return (
    <section className="border-y border-border/70 bg-secondary/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="Featured courses"
          title="Popular with our students"
          description="Hand-picked courses to get you started."
          action={
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full bg-card px-4"
            >
              <Link to="/courses">
                View all courses
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          }
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            Array.from({ length: FEATURED_COUNT }, (_, index) => (
              <li key={index} aria-hidden>
                <CourseCardSkeleton />
              </li>
            ))}

          {courses.map((course) => (
            <li key={course.id}>
              <CourseCard course={course} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default FeaturedCoursesSection;
