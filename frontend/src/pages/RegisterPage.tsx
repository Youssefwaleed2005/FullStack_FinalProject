import { useState } from "react";
import type { FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../services/api";

const INITIAL = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  country: "",
  preferredLanguage: "",
  password: "",
  confirmPassword: "",
};

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function setField(name: keyof typeof INITIAL, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function validate() {
    const errors: Record<string, string> = {};
    if (!form.firstName.trim()) errors.firstName = "First name is required.";
    if (!form.lastName.trim()) errors.lastName = "Last name is required.";
    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      errors.email = "Enter a valid email.";
    if (form.password.length < 8)
      errors.password = "Password must be at least 8 characters.";
    if (form.confirmPassword !== form.password)
      errors.confirmPassword = "Passwords do not match.";
    if (!acceptedTerms)
      errors.acceptedTerms = "You must accept the terms and conditions.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        phoneNumber: form.phoneNumber || undefined,
        country: form.country || undefined,
        preferredLanguage: form.preferredLanguage || undefined,
        acceptedTerms,
      });
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not create your account."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h5" gutterBottom>
          Create your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="First name"
                value={form.firstName}
                onChange={(e) => setField("firstName", e.target.value)}
                error={Boolean(fieldErrors.firstName)}
                helperText={fieldErrors.firstName}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Last name"
                value={form.lastName}
                onChange={(e) => setField("lastName", e.target.value)}
                error={Boolean(fieldErrors.lastName)}
                helperText={fieldErrors.lastName}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Mobile number"
                value={form.phoneNumber}
                onChange={(e) => setField("phoneNumber", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Country"
                value={form.country}
                onChange={(e) => setField("country", e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Preferred language"
                value={form.preferredLanguage}
                onChange={(e) => setField("preferredLanguage", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                error={Boolean(fieldErrors.password)}
                helperText={fieldErrors.password}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Confirm password"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setField("confirmPassword", e.target.value)}
                error={Boolean(fieldErrors.confirmPassword)}
                helperText={fieldErrors.confirmPassword}
              />
            </Grid>
          </Grid>

          <FormControlLabel
            sx={{ mt: 1 }}
            control={
              <Checkbox
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
            }
            label="I accept the terms and conditions"
          />
          {fieldErrors.acceptedTerms && (
            <Typography variant="caption" sx={{ color: "error.main", display: "block" }}>
              {fieldErrors.acceptedTerms}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            disabled={submitting}
            sx={{ mt: 2 }}
          >
            {submitting ? <CircularProgress size={24} /> : "Create account"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3 }}>
          Already have an account? <Link to="/login">Log in</Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default RegisterPage;
