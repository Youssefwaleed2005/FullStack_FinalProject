import { Check, Mail } from "lucide-react";
import Avatar from "@/components/Avatar";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { LearnerCourseDetail } from "@/types/Learner";

type LearnerOverviewTabProps = {
  course: LearnerCourseDetail;
};

// Course description, objectives and how to reach the instructor
function LearnerOverviewTab({ course }: LearnerOverviewTabProps) {
  const instructor = course.instructor;
  const objectives = (course.objectives ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
      <div className={cn(panelStyle, "flex flex-col gap-8 p-6")}>
        <section>
          <h2 className="text-xl font-semibold">About this course</h2>
          <p className="mt-3 leading-relaxed whitespace-pre-line text-muted-foreground">
            {course.fullDescription ??
              course.shortDescription ??
              "No description yet."}
          </p>
        </section>

        {objectives.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold">What you will learn</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {objectives.map((objective) => (
                <li
                  key={objective}
                  className="flex gap-3 text-sm leading-relaxed"
                >
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
      </div>

      <aside className={cn(panelStyle, "p-6")}>
        <h2 className="text-xl font-semibold">Instructor</h2>
        {instructor ? (
          <>
            <div className="mt-4 flex items-center gap-3">
              <Avatar
                name={instructor.fullName}
                photoUrl={instructor.photoUrl}
                className="size-12 text-sm"
              />
              <div className="min-w-0">
                <p className="font-semibold">{instructor.fullName}</p>
                {instructor.specialization && (
                  <p className="text-sm text-muted-foreground">
                    {instructor.specialization}
                  </p>
                )}
              </div>
            </div>
            <a
              href={`mailto:${instructor.email}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium break-all text-sand-deep underline-offset-4 hover:underline"
            >
              <Mail aria-hidden className="size-4 shrink-0" />
              {instructor.email}
            </a>
            {instructor.bio && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {instructor.bio}
              </p>
            )}
          </>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            No instructor assigned yet.
          </p>
        )}
      </aside>
    </div>
  );
}

export default LearnerOverviewTab;
