import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, CircleCheck, CreditCard, LoaderCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMyLearning } from "@/hooks/useMyLearning";
import { useToast } from "@/hooks/useToast";
import { getApiErrorMessage, hasStatus } from "@/services/api";
import {
  createApplication,
  getMyApplications,
} from "@/services/applicationService";
import type { CourseStatus } from "@/types/Course";

type ApplyButtonProps = {
  // Pass courseId OR programId
  courseId?: number;
  programId?: number;
  status: CourseStatus;
};

// Creates an application for the course/program and sends the learner on to pay for it.
// Already enrolled → "Go to course" instead; applied but not paid → "Continue to payment".
function ApplyButton({ courseId, programId, status }: ApplyButtonProps) {
  const { isAuthenticated, hasRole } = useAuth();
  const { courseState, programState, refresh } = useMyLearning();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  // The API said "already enrolled" before our own data knew it (e.g. enrolled in another tab)
  const [enrolledFromApi, setEnrolledFromApi] = useState(false);

  const isOpen = status === "OpenForEnrollment";
  const isLearner = hasRole("Learner");
  const isProgram = courseId === undefined;
  const learning = isProgram ? programState(programId ?? 0) : courseState(courseId);

  async function handleApply() {
    // Not signed in: log in first, then come back to this page
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    setLoading(true);
    try {
      const application = await createApplication({ courseId, programId });
      toast.success("Application submitted", "Complete the payment to secure your place.");
      refresh();
      navigate(`/payment/${application.id}`);
    } catch (applyError) {
      // 409 means they already applied, so look up that application instead
      if (hasStatus(applyError, 409)) {
        try {
          const mine = await getMyApplications();
          const existing = mine.find(
            (application) =>
              (courseId !== undefined && application.courseId === courseId) ||
              (programId !== undefined && application.programId === programId),
          );
          // Applied but not paid yet: continue to the payment
          if (existing?.status === "Submitted") {
            toast.info("You already applied", "Complete the payment to secure your place.");
            navigate(`/payment/${existing.id}`);
            return;
          }
          if (existing?.status === "Accepted") {
            setEnrolledFromApi(true);
            refresh();
            return;
          }
        } catch {
          // Fall through to the generic message below
        }
      }
      toast.error(
        "Could not submit your application",
        getApiErrorMessage(applyError, "Please try again."),
      );
    } finally {
      setLoading(false);
    }
  }

  // Already enrolled (directly, or in a program that includes this course)
  if (learning?.kind === "enrolled" || enrolledFromApi) {
    const completed = learning?.kind === "enrolled" && learning.status === "Completed";
    const viaProgram = learning?.kind === "enrolled" ? learning.viaProgram : null;
    const what = isProgram ? "program" : "course";
    return (
      <div className="mt-5 flex flex-col gap-3">
        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100">
          <CircleCheck />
          <AlertDescription className="text-emerald-900/80 dark:text-emerald-100/80">
            {completed ? `You completed this ${what}.` : `You're already enrolled in this ${what}.`}
            {viaProgram && ` It's part of your ${viaProgram} program.`}
          </AlertDescription>
        </Alert>
        <Button asChild size="lg" className="h-12 w-full rounded-full text-base">
          <Link to={isProgram ? "/my-enrollments" : `/learning/courses/${courseId}`}>
            {isProgram ? "Go to my learning" : "Go to course"}
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    );
  }

  // Applied, not paid yet: finish that application instead of starting a new one
  if (learning?.kind === "pending") {
    return (
      <div className="mt-5">
        <Button asChild size="lg" className="h-12 w-full rounded-full text-base">
          <Link to={`/payment/${learning.applicationId}`}>
            <CreditCard data-icon="inline-start" />
            Continue to payment
          </Link>
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          You've already applied. Pay to secure your place.
        </p>
      </div>
    );
  }

  // Short explanation under the button when it can't be used
  let hint = "";
  if (!isOpen) hint = "Applications are not open right now.";
  else if (!isAuthenticated) hint = "You will be asked to log in first.";
  else if (!isLearner) hint = "Only learner accounts can apply.";

  return (
    <div className="mt-5">
      <Button
        size="lg"
        className="h-12 w-full rounded-full text-base"
        disabled={!isOpen || (isAuthenticated && !isLearner) || loading}
        onClick={handleApply}
      >
        {loading ? (
          <>
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
            Applying…
          </>
        ) : (
          <>
            Apply now
            <ArrowRight data-icon="inline-end" />
          </>
        )}
      </Button>

      {hint && (
        <p className="mt-2 text-center text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

export default ApplyButton;
