import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getMyEnrollments } from "../services/enrollmentService";
import { getApiErrorMessage } from "../services/api";
import type { Enrollment, EnrollmentStatus } from "../types/Enrollment";

const PLACEHOLDER_IMAGE = "https://placehold.co/400x240?text=Course";

const STATUS_COLOR: Record<
  EnrollmentStatus,
  "success" | "warning" | "info" | "default"
> = {
  Active: "success",
  Paused: "warning",
  Completed: "info",
  Cancelled: "default",
};

function MyEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getMyEnrollments()
      .then((data) => {
        if (active) setEnrollments(data);
      })
      .catch((err) => {
        if (active)
          setError(getApiErrorMessage(err, "Could not load your enrollments."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        My learning
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Everything you are enrolled in.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {enrollments.length === 0 && !error && (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography sx={{ mb: 2 }}>
            You are not enrolled in anything yet. Apply to a course and complete
            the payment to get started.
          </Typography>
          <Button
            component={Link}
            to="/courses"
            variant="contained"
            color="secondary"
          >
            Browse courses
          </Button>
        </Paper>
      )}

      <Stack spacing={2}>
        {enrollments.map((enrollment) => (
          <Paper
            key={enrollment.id}
            sx={{ p: 2, display: "flex", gap: 2, flexWrap: "wrap" }}
          >
            <Box
              component="img"
              src={enrollment.imageUrl ?? PLACEHOLDER_IMAGE}
              alt={enrollment.targetTitle}
              sx={{
                width: { xs: "100%", sm: 160 },
                height: 110,
                objectFit: "cover",
                borderRadius: 1,
              }}
            />

            <Box sx={{ flex: "1 1 260px" }}>
              <Typography variant="h6">{enrollment.targetTitle}</Typography>

              <Stack direction="row" spacing={1} sx={{ my: 1 }}>
                <Chip size="small" label={enrollment.targetType} />
                <Chip
                  size="small"
                  label={enrollment.status}
                  color={STATUS_COLOR[enrollment.status]}
                />
              </Stack>

              <Typography variant="body2" color="text.secondary">
                Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
              </Typography>

              <Box sx={{ mt: 1.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Progress — {enrollment.progressPercent}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={enrollment.progressPercent}
                  color="secondary"
                  sx={{ mt: 0.5, height: 8, borderRadius: 4 }}
                />
              </Box>

              <Button
                component={Link}
                to={
                  enrollment.targetType === "Course"
                    ? `/learning/courses/${enrollment.courseId}`
                    : `/programs/${enrollment.programId}`
                }
                color="secondary"
                sx={{ mt: 1, px: 0 }}
              >
                Open {enrollment.targetType.toLowerCase()} →
              </Button>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}

export default MyEnrollmentsPage;
