import { useId, useState, type FormEvent } from "react";
import { CircleAlert, TriangleAlert } from "lucide-react";
import FormField from "@/components/FormField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/services/api";
import type {
  LearnerAssignment,
  SubmitAssignmentRequest,
} from "@/types/Learner";

type SubmitAssignmentDialogProps = {
  assignment: LearnerAssignment;
  onClose: () => void;
  onSubmit: (payload: SubmitAssignmentRequest) => Promise<void>;
};

// Form for a new submission, or for editing one that is not graded yet
function SubmitAssignmentDialog({
  assignment,
  onClose,
  onSubmit,
}: SubmitAssignmentDialogProps) {
  const answerId = useId();
  const existing = assignment.mySubmission;
  const [content, setContent] = useState(existing?.content ?? "");
  const [fileUrl, setFileUrl] = useState(existing?.fileUrl ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = content.trim();
    const link = fileUrl.trim();

    if (!text && !link) {
      setError("Write an answer or add a link.");
      return;
    }
    if (link && !/^https?:\/\//i.test(link)) {
      setError("The link must start with http:// or https://");
      return;
    }

    setError("");
    setSaving(true);
    try {
      // Empty fields go as undefined, never "" (the API rejects an empty link)
      await onSubmit({
        content: text || undefined,
        fileUrl: link || undefined,
      });
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not submit the assignment."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>
              {existing ? "Edit submission" : "Submit assignment"}
            </DialogTitle>
            <DialogDescription>{assignment.title}</DialogDescription>
          </DialogHeader>

          {assignment.isPastDue && (
            <Alert>
              <TriangleAlert className="text-amber-600" />
              <AlertDescription>
                The due date has passed. Your submission will be marked as
                late.
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive">
              <CircleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor={answerId}>Your answer</Label>
            <Textarea
              id={answerId}
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-28 bg-card px-3"
            />
          </div>
          <FormField
            label="Link (GitHub, Drive…)"
            type="url"
            placeholder="https://"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={saving}>
              {saving ? "Submitting…" : existing ? "Update" : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SubmitAssignmentDialog;
