import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert, Button, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../services/api";
import {
  createApplication,
  getMyApplications,
} from "../services/applicationService";
import type { Course } from "../types/Course";

type ApplyButtonProps = {
  courseId?: number;
  programId?: number;
  status: Course["status"];
};

function ApplyButton({ courseId, programId, status }: ApplyButtonProps) {
  const { isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isOpen = status === "OpenForEnrollment";
  const isLearner = hasRole("Learner");

  async function handleApply() {
    // Not logged in → go to login, then come back here
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    setError("");
    setLoading(true);
    try {
      const application = await createApplication({ courseId, programId });
      navigate(`/payment/${application.id}`);
    } catch (err) {
      // 409 = already applied → find that application instead
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        const mine = await getMyApplications();
        const existing = mine.find(
          (a) =>
            (courseId !== undefined && a.courseId === courseId) ||
            (programId !== undefined && a.programId === programId),
        );
        if (existing?.status === "Submitted") {
          navigate(`/payment/${existing.id}`); // applied but not paid yet
          return;
        }
        if (existing?.status === "Accepted") {
          setError("You are already enrolled.");
          return;
        }
      }
      setError(getApiErrorMessage(err, "Could not submit your application."));
    } finally {
      setLoading(false);
    }
  }

  // Helper text under the button
  let hint = "";
  if (!isOpen) hint = "Applications are not open right now.";
  else if (!isAuthenticated) hint = "You will be asked to log in first.";
  else if (!isLearner) hint = "Only learners can apply.";

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        disabled={!isOpen || (isAuthenticated && !isLearner) || loading}
        onClick={handleApply}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : "Apply now"}
      </Button>

      {hint && (
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 1, color: "text.secondary" }}
        >
          {hint}
        </Typography>
      )}

      {error && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </>
  );
}

export default ApplyButton;
