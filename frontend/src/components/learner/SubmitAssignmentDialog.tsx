import { useState } from "react";
import type { FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { getApiErrorMessage } from "../../services/api";
import type {
  LearnerAssignment,
  SubmitAssignmentRequest,
} from "../../types/Learner";

type Props = {
  assignment: LearnerAssignment;
  onClose: () => void;
  onSubmit: (payload: SubmitAssignmentRequest) => Promise<void>;
};

function SubmitAssignmentDialog({ assignment, onClose, onSubmit }: Props) {
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
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle>
          {existing ? "Edit submission" : "Submit assignment"}:{" "}
          {assignment.title}
        </DialogTitle>
        <DialogContent>
          {assignment.isPastDue && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              The due date has passed. Your submission will be marked as late.
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            margin="normal"
            label="Your answer"
            multiline
            minRows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Link (GitHub, Drive...)"
            placeholder="https://"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={saving}
          >
            {saving ? "Submitting..." : existing ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default SubmitAssignmentDialog;
