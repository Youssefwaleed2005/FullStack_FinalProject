import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { getApiErrorMessage } from "../../services/api";
import {
  getAssignmentSubmissions,
  gradeSubmission,
} from "../../services/instructorService";
import type { Assignment, Submission } from "../../types/Lms";
import { formatDateTime } from "../../utils/formatDate";

type Props = {
  assignment: Assignment;
  onClose: () => void;
  onGraded: () => void;
};

function SubmissionsDialog({ assignment, onClose, onGraded }: Props) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setSubmissions(await getAssignmentSubmissions(assignment.id));
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load submissions."));
    } finally {
      setLoading(false);
    }
  }, [assignment.id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Submissions
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {assignment.title} · max {assignment.maxScore} points
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && submissions.length === 0 && (
          <Typography sx={{ color: "text.secondary" }}>
            No submissions yet.
          </Typography>
        )}

        {submissions.map((s, i) => (
          <Box key={s.id}>
            {i > 0 && <Divider sx={{ my: 2 }} />}
            <SubmissionRow
              submission={s}
              onGraded={async () => {
                await load();
                onGraded();
              }}
            />
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// One submission + its grading form
function SubmissionRow({
  submission,
  onGraded,
}: {
  submission: Submission;
  onGraded: () => void;
}) {
  const [score, setScore] = useState(submission.score?.toString() ?? "");
  const [feedback, setFeedback] = useState(submission.feedback ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleGrade() {
    const value = Number(score);
    if (
      score === "" ||
      !Number.isInteger(value) ||
      value < 0 ||
      value > submission.maxScore
    ) {
      setError(
        `Score must be a whole number from 0 to ${submission.maxScore}.`,
      );
      return;
    }

    setError("");
    setSaving(true);
    try {
      await gradeSubmission(submission.id, {
        score: value,
        feedback: feedback || undefined,
      });
      setSaved(true);
      onGraded();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save the grade."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 600 }}>
            {submission.studentName}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {submission.studentEmail} · submitted{" "}
            {formatDateTime(submission.submittedAt)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
          {submission.isLate && (
            <Chip size="small" color="warning" label="Late" />
          )}
          <Chip
            size="small"
            color={submission.status === "Graded" ? "success" : "default"}
            label={
              submission.status === "Graded"
                ? `Graded ${submission.score}/${submission.maxScore}`
                : "Not graded"
            }
          />
        </Box>
      </Box>

      {submission.content && (
        <Typography variant="body2" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
          {submission.content}
        </Typography>
      )}
      {submission.fileUrl && (
        <MuiLink
          href={submission.fileUrl}
          target="_blank"
          rel="noopener"
          color="secondary"
        >
          Open submitted link
        </MuiLink>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
      {saved && (
        <Alert severity="success" sx={{ mt: 1 }}>
          Grade saved.
        </Alert>
      )}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        sx={{ mt: 1.5 }}
      >
        <TextField
          size="small"
          label={`Score / ${submission.maxScore}`}
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          sx={{ width: { sm: 140 } }}
        />
        <TextField
          size="small"
          label="Feedback"
          fullWidth
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleGrade}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : submission.status === "Graded"
              ? "Update"
              : "Grade"}
        </Button>
      </Stack>
    </Box>
  );
}

export default SubmissionsDialog;
