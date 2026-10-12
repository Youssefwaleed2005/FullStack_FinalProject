import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Info, LoaderCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
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

// Creates an application for the course/program and sends the learner on to pay for it
function ApplyButton({ courseId, programId, status }: ApplyButtonProps) {
  const { isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);

  const isOpen = status === "OpenForEnrollment";
  const isLearner = hasRole("Learner");

  async function handleApply() {
    // Not signed in: log in first, then come back to this page
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    setError("");
    setLoading(true);
    try {
      const application = await createApplication({ courseId, programId });
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
            navigate(`/payment/${existing.id}`);
            return;
          }
          if (existing?.status === "Accepted") {
            setAlreadyEnrolled(true);
            return;
          }
        } catch {
          // Fall through to the generic message below
        }
      }
      setError(
        getApiErrorMessage(applyError, "Could not submit your application."),
      );
    } finally {
      setLoading(false);
    }
  }

  // Short explanation under the button when it can't be used
  let hint = "";
  if (!isOpen) hint = "Applications are not open right now.";
  else if (!isAuthenticated) hint = "You will be asked to log in first.";
  else if (!isLearner) hint = "Only learner accounts can apply.";

  if (alreadyEnrolled) {
    return (
      <Alert className="mt-5 border-emerald-200 bg-emerald-50 text-emerald-900">
        <Info />
        <AlertDescription className="text-emerald-900/80">
          You are already enrolled.{" "}
          <Link to="/my-enrollments" className="font-medium">
            Go to my learning
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

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

      {error && (
        <Alert variant="destructive" className="mt-4">
          <Info />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default ApplyButton;
