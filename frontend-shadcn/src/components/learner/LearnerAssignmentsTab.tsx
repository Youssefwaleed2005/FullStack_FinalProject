import { useCallback, useState } from "react";
import { ClipboardList, CloudOff } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import StateMessage from "@/components/StateMessage";
import StatusPill from "@/components/StatusPill";
import SubmitAssignmentDialog from "@/components/learner/SubmitAssignmentDialog";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/hooks/useApiData";
import { formatDateTime } from "@/lib/course";
import type { StatusMeta } from "@/lib/status";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import {
  getLearnerAssignments,
  submitAssignment,
} from "@/services/learnerService";
import type {
  LearnerAssignment,
  SubmitAssignmentRequest,
} from "@/types/Learner";

function getAssignmentStatus(assignment: LearnerAssignment): StatusMeta {
  const submission = assignment.mySubmission;
  if (submission?.status === "Graded")
    return {
      label: `Graded: ${submission.score}/${assignment.maxScore}`,
      dot: "bg-emerald-500",
    };
  if (submission?.isLate)
    return { label: "Submitted late", dot: "bg-amber-500" };
  if (submission) return { label: "Submitted", dot: "bg-sky-500" };
  if (assignment.isPastDue) return { label: "Overdue", dot: "bg-rose-500" };
  return { label: "To do", dot: "bg-amber-500" };
}

type LearnerAssignmentsTabProps = {
  courseId: number;
  canSubmit: boolean;
  // Lets the page refresh the progress bar
  onSubmitted: () => void;
};

// The course assignments, the learner's submissions and their grades
function LearnerAssignmentsTab({
  courseId,
  canSubmit,
  onSubmitted,
}: LearnerAssignmentsTabProps) {
  const loadAssignments = useCallback(
    () => getLearnerAssignments(courseId),
    [courseId],
  );
  const {
    data: assignments,
    loading,
    failed,
    error,
    reload,
  } = useApiData(loadAssignments);
  const [submitting, setSubmitting] = useState<LearnerAssignment | null>(null);

  // Errors are thrown back to the dialog, which shows them
  async function handleSubmit(payload: SubmitAssignmentRequest) {
    if (!submitting) return;
    await submitAssignment(submitting.id, payload);
    setSubmitting(null);
    reload();
    onSubmitted();
  }

  if (loading) return <LoadingState label="Loading assignments…" />;

  if (failed || !assignments) {
    return (
      <StateMessage
        icon={CloudOff}
        title="Something went wrong"
        description={getApiErrorMessage(error, "Could not load assignments.")}
      />
    );
  }

  if (assignments.length === 0) {
    return (
      <StateMessage
        icon={ClipboardList}
        title="No assignments yet"
        description="Assignments from your instructor will show up here."
      />
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold">Assignments</h2>

      <ul className={cn(panelStyle, "mt-5 divide-y")}>
        {assignments.map((assignment) => {
          const submission = assignment.mySubmission;
          const graded = submission?.status === "Graded";

          return (
            <li key={assignment.id} className="p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold">{assignment.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Due {formatDateTime(assignment.dueDate)} ·{" "}
                    {assignment.maxScore} points
                  </p>
                </div>
                <StatusPill
                  status={getAssignmentStatus(assignment)}
                  className="self-start"
                />
              </div>

              {assignment.description && (
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">
                  {assignment.description}
                </p>
              )}

              {submission && (
                <div className="mt-4 rounded-xl bg-secondary/60 p-4">
                  <p className="text-xs text-muted-foreground">
                    Submitted {formatDateTime(submission.submittedAt)}
                    {submission.isLate ? " (late)" : ""}
                  </p>
                  {submission.content && (
                    <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line">
                      {submission.content}
                    </p>
                  )}
                  {submission.fileUrl && (
                    <a
                      href={submission.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 block text-sm font-medium break-all text-sand-deep underline-offset-4 hover:underline"
                    >
                      {submission.fileUrl}
                    </a>
                  )}
                  {graded && submission.feedback && (
                    <p className="mt-3 border-t border-border/70 pt-3 text-sm leading-relaxed">
                      <span className="font-semibold">Feedback:</span>{" "}
                      {submission.feedback}
                    </p>
                  )}
                </div>
              )}

              {canSubmit && !graded && (
                <Button
                  size="sm"
                  variant={submission ? "outline" : "default"}
                  className="mt-4 rounded-full px-4"
                  onClick={() => setSubmitting(assignment)}
                >
                  {submission ? "Edit submission" : "Submit"}
                </Button>
              )}
            </li>
          );
        })}
      </ul>

      {submitting && (
        <SubmitAssignmentDialog
          assignment={submitting}
          onClose={() => setSubmitting(null)}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
}

export default LearnerAssignmentsTab;
