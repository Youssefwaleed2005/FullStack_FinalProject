import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CloudOff } from "lucide-react";
import AccountLayout from "@/components/AccountLayout";
import CoverImage from "@/components/CoverImage";
import LoadingState from "@/components/LoadingState";
import StateMessage from "@/components/StateMessage";
import StatusPill from "@/components/StatusPill";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useApiData } from "@/hooks/useApiData";
import { formatDate } from "@/lib/course";
import { ENROLLMENT_STATUS_META } from "@/lib/status";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { getMyEnrollments } from "@/services/enrollmentService";
import type { Enrollment } from "@/types/Enrollment";

function MyEnrollmentsPage() {
  const { data, loading, failed, error } = useApiData(getMyEnrollments);

  return (
    <AccountLayout
      title="My learning"
      description="Everything you are enrolled in, and how far along you are."
    >
      {loading && <LoadingState label="Loading your enrollments…" />}

      {failed && (
        <StateMessage
          icon={CloudOff}
          title="Something went wrong"
          description={getApiErrorMessage(
            error,
            "Could not load your enrollments.",
          )}
        />
      )}

      {data && data.length === 0 && (
        <StateMessage
          icon={BookOpen}
          title="Nothing here yet"
          description="Apply to a course and complete the payment to get started."
          action={
            <Button asChild size="lg" className="rounded-full px-5">
              <Link to="/courses">Browse courses</Link>
            </Button>
          }
        />
      )}

      {data && data.length > 0 && (
        <ul className="flex flex-col gap-4">
          {data.map((enrollment) => (
            <li key={enrollment.id}>
              <EnrollmentItem enrollment={enrollment} />
            </li>
          ))}
        </ul>
      )}
    </AccountLayout>
  );
}

type EnrollmentItemProps = {
  enrollment: Enrollment;
};

function EnrollmentItem({ enrollment }: EnrollmentItemProps) {
  const targetLink =
    enrollment.targetType === "Course"
      ? `/learning/courses/${enrollment.courseId}`
      : `/programs/${enrollment.programId}`;

  return (
    <article
      className={cn(
        panelStyle,
        "flex flex-col overflow-hidden sm:flex-row sm:items-stretch",
      )}
    >
      <CoverImage
        src={enrollment.imageUrl}
        title={enrollment.targetTitle}
        className="aspect-[16/9] sm:aspect-auto sm:w-52 sm:shrink-0"
        letterClassName="text-5xl"
      />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold tracking-[0.14em] text-sand-deep uppercase">
            {enrollment.targetType}
          </p>
          <StatusPill status={ENROLLMENT_STATUS_META[enrollment.status]} />
        </div>

        <h2 className="mt-2 text-xl leading-snug font-semibold">
          {enrollment.targetTitle}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enrolled {formatDate(enrollment.enrolledAt)}
        </p>

        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="font-semibold text-foreground">
              {enrollment.progressPercent}%
            </span>
          </div>
          <Progress
            value={enrollment.progressPercent}
            aria-label={`${enrollment.targetTitle} progress`}
            className="mt-2 h-2 bg-secondary"
          />
        </div>

        <Button
          asChild
          variant="link"
          className="mt-3 h-auto self-start px-0 text-sand-deep"
        >
          <Link to={targetLink}>
            Open {enrollment.targetType.toLowerCase()}
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

export default MyEnrollmentsPage;
