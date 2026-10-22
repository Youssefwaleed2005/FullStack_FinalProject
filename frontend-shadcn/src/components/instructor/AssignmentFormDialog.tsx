import { useState, type FormEvent } from "react";
import FormField from "@/components/FormField";
import FormDialog from "@/components/manage/FormDialog";
import { TextareaField } from "@/components/manage/fields";
import { fromLocalInputValue, toLocalInputValue } from "@/lib/dates";
import { getApiErrorMessage } from "@/services/api";
import type { Assignment, AssignmentRequest } from "@/types/Lms";

type AssignmentFormDialogProps = {
  open: boolean;
  assignment: Assignment | null; // null = new
  onClose: () => void;
  onSave: (payload: AssignmentRequest) => Promise<void>;
};

// Add / edit an assignment
function AssignmentFormDialog({ open, assignment, onClose, onSave }: AssignmentFormDialogProps) {
  const [title, setTitle] = useState(assignment?.title ?? "");
  const [description, setDescription] = useState(assignment?.description ?? "");
  const [dueDate, setDueDate] = useState(toLocalInputValue(assignment?.dueDate));
  const [maxScore, setMaxScore] = useState(String(assignment?.maxScore ?? 100));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const score = Number(maxScore);
    if (!title.trim() || !dueDate) return setError("Title and due date are required.");
    if (!Number.isInteger(score) || score < 1 || score > 1000)
      return setError("Max score must be a whole number between 1 and 1000.");

    setError("");
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: fromLocalInputValue(dueDate),
        maxScore: score,
      });
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save the assignment."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormDialog
      open={open}
      title={assignment ? "Edit assignment" : "Add assignment"}
      error={error}
      saving={saving}
      submitLabel={assignment ? "Save changes" : "Add assignment"}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <FormField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextareaField label="Instructions" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
      <div className="grid gap-4 sm:grid-cols-[1fr_9rem]">
        <FormField label="Due date" type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <FormField label="Max score" type="number" min={1} max={1000} value={maxScore} onChange={(e) => setMaxScore(e.target.value)} />
      </div>
    </FormDialog>
  );
}

export default AssignmentFormDialog;
