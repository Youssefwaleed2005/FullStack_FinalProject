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
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../services/api";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      errors.email = "Enter a valid email.";
    if (!password) errors.password = "Password is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login({ email, password, rememberMe });
      navigate(from, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not sign you in."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h5" gutterBottom>
          Log in
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={Boolean(fieldErrors.email)}
            helperText={fieldErrors.email}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
            label="Remember me"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            disabled={submitting}
            sx={{ mt: 2 }}
          >
            {submitting ? <CircularProgress size={24} /> : "Log in"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3 }}>
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default LoginPage;
