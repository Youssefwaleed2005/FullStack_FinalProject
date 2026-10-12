import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { Check } from "lucide-react";
import ApplyButton from "@/components/ApplyButton";
import Avatar from "@/components/Avatar";
import CourseCard from "@/components/CourseCard";
import DetailRow from "@/components/DetailRow";
import DetailsHeader from "@/components/DetailsHeader";
import DetailsLoadError from "@/components/DetailsLoadError";
import LoadingState from "@/components/LoadingState";
import StatusPill from "@/components/StatusPill";
import { useApiData } from "@/hooks/useApiData";
import { STATUS_META, formatDate, formatPrice } from "@/lib/course";
import { pageContainer, panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getCourseById, getRelatedCourses } from "@/services/courseService";

// Reads the id from the URL and gives each course its own fresh page
function CourseDetailsPage() {
  const { id } = useParams();
  return <CourseDetailsContent key={id} courseId={Number(id)} />;
}

type CourseDetailsContentProps = {
  courseId: number;
};

function CourseDetailsContent({ courseId }: CourseDetailsContentProps) {
  const loadCourse = useCallback(
    () =>
      Promise.all([
        getCourseById(courseId),
        // Related courses are a nice extra, so a failure there doesn't break the page
        getRelatedCourses(courseId).catch(() => []),
      ]),
    [courseId],
  );
  const { data, loading, failed, error } = useApiData(loadCourse);

  if (loading) return <LoadingState label="Loading course…" />;

  if (failed || !data) {
    return (
      <DetailsLoadError
        error={error}
        itemName="course"
        back={{ label: "Back to courses", to: "/courses" }}
      />
    );
  }

  const [course, relatedCourses] = data;
  const objectives = (course.objectives ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <>
      <DetailsHeader
        parent={{ label: "Courses", to: "/courses" }}
        title={course.title}
        description={course.shortDescription}
        image={{ src: course.imageUrl }}
        badges={
          <>
            <StatusPill status={STATUS_META[course.status]} />
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
              {course.categoryName}
            </span>
            <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {course.type}
            </span>
          </>
        }
      />

      <div
        className={cn(
          pageContainer,
          "grid gap-10 py-12 lg:grid-cols-[1fr_22rem] lg:items-start",
        )}
      >
        {/* Main column */}
        <div className="flex flex-col gap-12">
          {course.fullDescription && (
            <section>
              <h2 className="text-2xl font-semibold">About this course</h2>
              <p className="mt-4 leading-relaxed whitespace-pre-line text-muted-foreground">
                {course.fullDescription}
              </p>
            </section>
          )}

          {objectives.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold">What you will learn</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {objectives.map((objective) => (
                  <li key={objective} className="flex gap-3 text-sm leading-relaxed">
                    <span
                      aria-hidden
                      className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-sand-deep"
                    >
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {objective}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {course.instructorName && (
            <section>
              <h2 className="text-2xl font-semibold">Your instructor</h2>
              <div className={cn(panelStyle, "mt-5 flex flex-col gap-5 p-6 sm:flex-row sm:items-center")}>
                <Avatar
                  name={course.instructorName}
                  photoUrl={course.instructorPhotoUrl}
                  className="size-16 text-lg"
                />
                <div>
                  <p className="text-lg font-semibold">{course.instructorName}</p>
                  {course.instructorBio && (
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {course.instructorBio}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Key facts and the apply button; stays in view while scrolling on desktop */}
        <aside className={cn(panelStyle, "p-6 lg:sticky lg:top-24")}>
          <p className="text-sm text-muted-foreground">Price</p>
          <p className="mt-1 font-heading text-4xl font-semibold">
            {formatPrice(course.price)}
          </p>
          <dl className="mt-5 divide-y border-y">
            <DetailRow label="Duration" value={`${course.durationHours} hours`} />
            <DetailRow
              label="Location"
              value={course.type === "Online" ? "Online" : course.location}
            />
            <DetailRow label="Schedule" value={course.schedule} />
            <DetailRow
              label="Starts"
              value={course.startDate ? formatDate(course.startDate) : null}
            />
            <DetailRow
              label="Ends"
              value={course.endDate ? formatDate(course.endDate) : null}
            />
            <DetailRow label="Capacity" value={`${course.capacity} students`} />
          </dl>

          <ApplyButton courseId={course.id} status={course.status} />
        </aside>
      </div>

      {relatedCourses.length > 0 && (
        <section className="border-t border-border/70 bg-secondary/40">
          <div className={cn(pageContainer, "py-14")}>
            <h2 className="text-3xl font-semibold">Related courses</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCourses.map((related) => (
                <li key={related.id}>
                  <CourseCard course={related} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

export default CourseDetailsPage;
