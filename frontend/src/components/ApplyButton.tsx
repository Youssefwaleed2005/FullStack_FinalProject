import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { createApplication } from "../services/applicationService";
import { getApiErrorMessage } from "../services/api";
import type { Course } from "../types/Course";
import type { Application } from "../types/Application";

const captionSx = {
  display: "block",
  mt: 1,
  color: "text.secondary",
} as const;

type ApplyButtonProps = {
  targetType: "Course" | "Program";
  targetId: number;
  status: Course["status"];
};

function ApplyButton({ targetType, targetId, status }: ApplyButtonProps) {
  const { isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [application, setApplication] = useState<Application | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleApply() {
    setError("");
    setSubmitting(true);
    try {
      const created = await createApplication(
        targetType === "Course"
          ? { courseId: targetId }
          : { programId: targetId },
      );
      setApplication(created);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not submit your application."));
    } finally {
      setSubmitting(false);
    }
  }

  // Submitted just now
  if (application) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Application submitted for <strong>{application.targetTitle}</strong> —
          status {application.status}.
        </Alert>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={() => navigate("/applications")}
        >
          Continue to payment
        </Button>
      </Box>
    );
  }

  // Not accepting applications
  if (status !== "OpenForEnrollment") {
    return (
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="secondary" fullWidth disabled>
          Apply now
        </Button>
        <Typography variant="caption" sx={captionSx}>
          {status === "Full"
            ? "This is full — applications are closed."
            : status === "ComingSoon"
              ? "Coming soon. Applications are not open yet."
              : "Applications are not open for this."}
        </Typography>
      </Box>
    );
  }

  // Visitor
  if (!isAuthenticated) {
    return (
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={() =>
            navigate("/login", { state: { from: location.pathname } })
          }
        >
          Log in to apply
        </Button>
        <Typography variant="caption" sx={captionSx}>
          You need an account before you can apply.
        </Typography>
      </Box>
    );
  }

  // Signed in, but not a learner
  if (!hasRole("Learner")) {
    return (
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="secondary" fullWidth disabled>
          Apply now
        </Button>
        <Typography variant="caption" sx={captionSx}>
          Only learner accounts can apply.
        </Typography>
      </Box>
    );
  }

  // Ready to apply
  return (
    <Box sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={handleApply}
        disabled={submitting}
      >
        {submitting ? <CircularProgress size={24} /> : "Apply now"}
      </Button>
    </Box>
  );
}

export default ApplyButton;
