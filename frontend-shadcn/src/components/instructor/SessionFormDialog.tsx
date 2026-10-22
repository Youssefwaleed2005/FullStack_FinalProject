import { useState, type FormEvent } from "react";
import FormField from "@/components/FormField";
import FormDialog from "@/components/manage/FormDialog";
import { TextareaField } from "@/components/manage/fields";
import { fromLocalInputValue, toLocalInputValue } from "@/lib/dates";
import { getApiErrorMessage } from "@/services/api";
import type { Session, SessionRequest } from "@/types/Lms";

type SessionFormDialogProps = {
  open: boolean;
  session: Session | null; // null = new session
  onClose: () => void;
  onSave: (payload: SessionRequest) => Promise<void>;
};

// Add / edit a class session. Give it a new key each time it opens so the fields reset.
function SessionFormDialog({ open, session, onClose, onSave }: SessionFormDialogProps) {
  const [title, setTitle] = useState(session?.title ?? "");
  const [description, setDescription] = useState(session?.description ?? "");
  const [start, setStart] = useState(toLocalInputValue(session?.startTime));
  const [end, setEnd] = useState(toLocalInputValue(session?.endTime));
  const [location, setLocation] = useState(session?.location ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !start || !end) return setError("Title, start and end are required.");
    if (new Date(end) <= new Date(start)) return setError("End time must be after start time.");

    setError("");
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        startTime: fromLocalInputValue(start),
        endTime: fromLocalInputValue(end),
        location: location.trim() || undefined,
      });
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save the session."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormDialog
      open={open}
      title={session ? "Edit session" : "Add session"}
      description="Learners see sessions on their course page and dashboard."
      error={error}
      saving={saving}
      submitLabel={session ? "Save changes" : "Add session"}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <FormField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Week 3 — React state" />
      <TextareaField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Start" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
        <FormField label="End" type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
      </div>
      <FormField label="Location" hint="A room, or a meeting link for online sessions" value={location} onChange={(e) => setLocation(e.target.value)} />
    </FormDialog>
  );
}

export default SessionFormDialog;
