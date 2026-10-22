import { useCallback, useState } from "react";
import { CircleAlert, CircleCheck, ExternalLink, LoaderCircle } from "lucide-react";
import Avatar from "@/components/Avatar";
import Chip from "@/components/manage/Chip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useApiData } from "@/hooks/useApiData";
import { formatDateTime } from "@/lib/course";
import { getApiErrorMessage } from "@/services/api";
import { getAssignmentSubmissions, gradeSubmission } from "@/services/instructorService";
import type { Assignment, Submission } from "@/types/Lms";

type SubmissionsDialogProps = {
  assignment: Assignment;
  onClose: () => void;
  onGraded: () => void;
};

// All submissions for one assignment, each with its own grading form
function SubmissionsDialog({ assignment, onClose, onGraded }: SubmissionsDialogProps) {
  const load = useCallback(() => getAssignmentSubmissions(assignment.id), [assignment.id]);
  const { data: submissions, loading, failed, error, reload } = useApiData(load);
  const graded = submissions?.filter((s) => s.status === "Graded").length ?? 0;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100svh-2rem)] gap-0 overflow-y-auto p-0 sm:max-w-3xl">
        <DialogHeader className="border-b border-border/70 p-5 pr-12">
          <DialogTitle className="text-xl">Submissions</DialogTitle>
          <DialogDescription>
            {assignment.title} · max {assignment.maxScore} points
            {submissions && submissions.length > 0 && ` · ${graded}/${submissions.length} graded`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 p-5">
          {loading && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle aria-hidden className="size-4 animate-spin" /> Loading submissions…
            </p>
          )}
          {failed && (
            <Alert variant="destructive">
              <AlertDescription>{getApiErrorMessage(error, "Could not load submissions.")}</AlertDescription>
            </Alert>
          )}
          {submissions && submissions.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">No submissions yet.</p>
          )}
          {submissions?.map((submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              onGraded={() => {
                reload();
                onGraded();
              }}
            />
          ))}
        </div>

        <DialogFooter className="mx-0 mb-0 px-5">
          <Button variant="outline" className="rounded-full px-4" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// One submission + its grading form
function SubmissionCard({ submission, onGraded }: { submission: Submission; onGraded: () => void }) {
  const [score, setScore] = useState(submission.score?.toString() ?? "");
  const [feedback, setFeedback] = useState(submission.feedback ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const isGraded = submission.status === "Graded";

  async function handleGrade() {
    const value = Number(score);
    if (score === "" || !Number.isInteger(value) || value < 0 || value > submission.maxScore)
      return setError(`Score must be a whole number from 0 to ${submission.maxScore}.`);

    setError("");
    setSaving(true);
    try {
      await gradeSubmission(submission.id, { score: value, feedback: feedback.trim() || undefined });
      setSaved(true);
      onGraded();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save the grade."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="rounded-2xl border border-border/80 bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={submission.studentName} className="size-10 text-xs" />
          <div className="min-w-0">
            <p className="truncate font-semibold">{submission.studentName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {submission.studentEmail} · {formatDateTime(submission.submittedAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {submission.isLate && <Chip tone="warning">Late</Chip>}
          <Chip tone={isGraded ? "success" : "neutral"}>
            {isGraded ? `Graded ${submission.score}/${submission.maxScore}` : "Not graded"}
          </Chip>
        </div>
      </div>

      {submission.content && (
        <p className="mt-3 rounded-xl bg-secondary/50 p-3 text-sm whitespace-pre-wrap">{submission.content}</p>
      )}
      {submission.fileUrl && (
        <a
          href={submission.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-sand-deep underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ExternalLink aria-hidden className="size-3.5" /> Open submitted link
        </a>
      )}

      {error && (
        <Alert variant="destructive" className="mt-3">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {saved && (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-emerald-700">
          <CircleCheck aria-hidden className="size-4" /> Grade saved
        </p>
      )}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <div className="relative sm:w-32">
          <Input
            type="number"
            min={0}
            max={submission.maxScore}
            aria-label={`Score out of ${submission.maxScore}`}
            placeholder="Score"
            value={score}
            onChange={(e) => {
              setScore(e.target.value);
              setSaved(false);
            }}
            className="h-10 bg-card pr-12 pl-3"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
            /{submission.maxScore}
          </span>
        </div>
        <Input
          aria-label="Feedback"
          placeholder="Feedback for the student (optional)"
          value={feedback}
          onChange={(e) => {
            setFeedback(e.target.value);
            setSaved(false);
          }}
          className="h-10 flex-1 bg-card px-3"
        />
        <Button className="h-10 rounded-full px-5" onClick={handleGrade} disabled={saving}>
          {saving && <LoaderCircle aria-hidden className="animate-spin" />}
          {saving ? "Saving…" : isGraded ? "Update" : "Grade"}
        </Button>
      </div>
    </article>
  );
}

export default SubmissionsDialog;
