import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Link as MuiLink,
  Paper,
  Typography,
} from "@mui/material";
import SubmitAssignmentDialog from "./SubmitAssignmentDialog";
import { getApiErrorMessage } from "../../services/api";
import {
  getLearnerAssignments,
  submitAssignment,
} from "../../services/learnerService";
import type {
  LearnerAssignment,
  SubmitAssignmentRequest,
} from "../../types/Learner";
import { formatDateTime } from "../../utils/formatDate";

function AssignmentStatusChip({
  assignment,
}: {
  assignment: LearnerAssignment;
}) {
  const sub = assignment.mySubmission;
  if (sub?.status === "Graded")
    return (
      <Chip
        size="small"
        color="success"
        label={`Graded: ${sub.score}/${assignment.maxScore}`}
      />
    );
  if (sub)
    return (
      <Chip
        size="small"
        color="info"
        label={sub.isLate ? "Submitted late" : "Submitted"}
      />
    );
  if (assignment.isPastDue)
    return <Chip size="small" color="error" label="Overdue" />;
  return <Chip size="small" color="warning" label="To do" />;
}

type Props = {
  courseId: number;
  canSubmit: boolean;
  onSubmitted: () => void; // lets the page refresh the progress bar
};

function LearnerAssignmentsTab({ courseId, canSubmit, onSubmitted }: Props) {
  const [assignments, setAssignments] = useState<LearnerAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState<LearnerAssignment | null>(null);

  const load = useCallback(async () => {
    try {
      setAssignments(await getLearnerAssignments(courseId));
      setError("");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load assignments."));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    load();
  }, [load]);

  // Errors are thrown back to the dialog, which shows them
  async function handleSubmit(payload: SubmitAssignmentRequest) {
    if (!submitting) return;
    await submitAssignment(submitting.id, payload);
    setSubmitting(null);
    await load();
    onSubmitted();
  }

  if (loading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Assignments
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {assignments.length === 0 ? (
        <Typography sx={{ color: "text.secondary" }}>
          No assignments yet.
        </Typography>
      ) : (
        <Paper>
          {assignments.map((a, i) => {
            const sub = a.mySubmission;
            const graded = sub?.status === "Graded";

            return (
              <Box key={a.id}>
                {i > 0 && <Divider />}
                <Box sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600 }}>
                        {a.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Due {formatDateTime(a.dueDate)} · {a.maxScore} points
                      </Typography>
                    </Box>
                    <AssignmentStatusChip assignment={a} />
                  </Box>

                  {a.description && (
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, whiteSpace: "pre-line" }}
                    >
                      {a.description}
                    </Typography>
                  )}

                  {/* My submission */}
                  {sub && (
                    <Box
                      sx={{
                        mt: 1.5,
                        p: 1.5,
                        bgcolor: "action.hover",
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        Submitted {formatDateTime(sub.submittedAt)}
                        {sub.isLate ? " (late)" : ""}
                      </Typography>
                      {sub.content && (
                        <Typography
                          variant="body2"
                          sx={{ mt: 0.5, whiteSpace: "pre-line" }}
                        >
                          {sub.content}
                        </Typography>
                      )}
                      {sub.fileUrl && (
                        <MuiLink
                          href={sub.fileUrl}
                          target="_blank"
                          rel="noopener"
                          color="secondary"
                          variant="body2"
                          sx={{
                            display: "block",
                            mt: 0.5,
                            wordBreak: "break-all",
                          }}
                        >
                          {sub.fileUrl}
                        </MuiLink>
                      )}
                      {graded && sub.feedback && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Feedback:</strong> {sub.feedback}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {canSubmit && !graded && (
                    <Button
                      size="small"
                      variant={sub ? "text" : "contained"}
                      color="secondary"
                      sx={{ mt: 1.5 }}
                      onClick={() => setSubmitting(a)}
                    >
                      {sub ? "Edit submission" : "Submit"}
                    </Button>
                  )}
                </Box>
              </Box>
            );
          })}
        </Paper>
      )}

      {submitting && (
        <SubmitAssignmentDialog
          assignment={submitting}
          onClose={() => setSubmitting(null)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}

export default LearnerAssignmentsTab;
