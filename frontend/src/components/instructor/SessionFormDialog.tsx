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
import type { Session, SessionRequest } from "../../types/Lms";
import { fromLocalInputValue, toLocalInputValue } from "../../utils/formatDate";

type Props = {
  open: boolean;
  session: Session | null; // null = new session
  onClose: () => void;
  onSave: (payload: SessionRequest) => Promise<void>;
};

function SessionFormDialog({ open, session, onClose, onSave }: Props) {
  // key={...} on the dialog (in SessionsTab) resets these when it opens
  const [title, setTitle] = useState(session?.title ?? "");
  const [description, setDescription] = useState(session?.description ?? "");
  const [start, setStart] = useState(toLocalInputValue(session?.startTime));
  const [end, setEnd] = useState(toLocalInputValue(session?.endTime));
  const [location, setLocation] = useState(session?.location ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !start || !end) {
      setError("Title, start and end are required.");
      return;
    }
    if (new Date(end) <= new Date(start)) {
      setError("End time must be after start time.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description || undefined,
        startTime: fromLocalInputValue(start),
        endTime: fromLocalInputValue(end),
        location: location || undefined,
      });
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save the session."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle>{session ? "Edit session" : "Add session"}</DialogTitle>
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
            label="Description"
            multiline
            minRows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              margin="normal"
              label="Start"
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="End"
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
          <TextField
            fullWidth
            margin="normal"
            label="Location (room or meeting link)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default SessionFormDialog;
