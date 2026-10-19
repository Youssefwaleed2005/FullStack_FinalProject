import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { getProfile, updateProfile } from "../services/authService";
import { getApiErrorMessage } from "../services/api";
import type { UserProfile } from "../types/Auth";

function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");

  function fill(data: UserProfile) {
    setProfile(data);
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setPhoneNumber(data.phoneNumber ?? "");
    setCountry(data.country ?? "");
    setPreferredLanguage(data.preferredLanguage ?? "");
  }

  useEffect(() => {
    let active = true;
    getProfile()
      .then((data) => {
        if (active) fill(data);
      })
      .catch((err) => {
        if (active)
          setError(getApiErrorMessage(err, "Could not load your profile."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      const updated = await updateProfile({
        firstName,
        lastName,
        phoneNumber: phoneNumber || undefined,
        country: country || undefined,
        preferredLanguage: preferredLanguage || undefined,
      });
      fill(updated);
      setSaved(true);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save your profile."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !profile) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h5">My profile</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {profile?.email}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ my: 2 }}>
          {profile?.roles.map((role) => (
            <Chip key={role} label={role} color="secondary" size="small" />
          ))}
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {saved && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Profile updated.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
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
          <TextField
            fullWidth
            margin="normal"
            label="Mobile number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Preferred language"
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={saving}
            sx={{ mt: 2 }}
          >
            {saving ? <CircularProgress size={24} /> : "Save changes"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ProfilePage;
