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
import { createInstructor } from "../../services/adminService";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

function CreateInstructorDialog({ open, onClose, onCreated }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError("First name, last name and email are required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      await createInstructor({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        phoneNumber: phoneNumber || undefined,
        specialization: specialization || undefined,
        bio: bio || undefined,
      });
      onCreated();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not create the instructor."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle>Add instructor</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              margin="normal"
              label="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Stack>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Temporary password (min 8 characters)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              margin="normal"
              label="Phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
          </Stack>
          <TextField
            fullWidth
            margin="normal"
            label="Bio"
            multiline
            minRows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
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
            {saving ? "Creating..." : "Create instructor"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default CreateInstructorDialog;
