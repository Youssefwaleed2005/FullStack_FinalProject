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
  Stack,
  TextField,
} from "@mui/material";
import { getApiErrorMessage } from "../../services/api";
import type { Assignment, AssignmentRequest } from "../../types/Lms";
import { fromLocalInputValue, toLocalInputValue } from "../../utils/formatDate";

type Props = {
  open: boolean;
  assignment: Assignment | null; // null = new
  onClose: () => void;
  onSave: (payload: AssignmentRequest) => Promise<void>;
};

function AssignmentFormDialog({ open, assignment, onClose, onSave }: Props) {
  const [title, setTitle] = useState(assignment?.title ?? "");
  const [description, setDescription] = useState(assignment?.description ?? "");
  const [dueDate, setDueDate] = useState(
    toLocalInputValue(assignment?.dueDate),
  );
  const [maxScore, setMaxScore] = useState(String(assignment?.maxScore ?? 100));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const score = Number(maxScore);
    if (!title.trim() || !dueDate) {
      setError("Title and due date are required.");
      return;
    }
    if (!Number.isInteger(score) || score < 1 || score > 1000) {
      setError("Max score must be a whole number between 1 and 1000.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description || undefined,
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle>
          {assignment ? "Edit assignment" : "Add assignment"}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Instructions"
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              margin="normal"
              label="Due date"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Max score"
              type="number"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
            />
          </Stack>
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
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default AssignmentFormDialog;
