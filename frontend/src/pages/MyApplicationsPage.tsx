import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getMyApplications } from "../services/applicationService";
import { getApiErrorMessage } from "../services/api";
import type { Application, ApplicationStatus } from "../types/Application";

const STATUS_COLOR: Record<
  ApplicationStatus,
  "default" | "info" | "success" | "error"
> = {
  Submitted: "info",
  Accepted: "success",
  Rejected: "error",
  Cancelled: "default",
};

function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getMyApplications()
      .then((data) => {
        if (active) setApplications(data);
      })
      .catch((err) => {
        if (active)
          setError(
            getApiErrorMessage(err, "Could not load your applications."),
          );
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
      <Typography variant="h4" sx={{ mb: 3 }}>
        My applications
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {applications.length === 0 && !error && (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography sx={{ mb: 2 }}>
            You haven&apos;t applied to anything yet.
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
        {applications.map((application) => (
          <Paper key={application.id} sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Typography variant="h6">{application.targetTitle}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip size="small" label={application.targetType} />
                  <Chip
                    size="small"
                    label={application.status}
                    color={STATUS_COLOR[application.status]}
                  />
                </Stack>
              </Box>
              <Typography variant="h6">{application.price} EGP</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Applied {new Date(application.createdAt).toLocaleDateString()}
              </Typography>

              {application.status === "Submitted" && (
                <Button
                  component={Link}
                  to={`/payment/${application.id}`}
                  variant="contained"
                  color="secondary"
                >
                  Pay now
                </Button>
              )}

              {application.status === "Accepted" && (
                <Button component={Link} to="/my-enrollments" color="secondary">
                  View my enrollment
                </Button>
              )}
            </Box>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}

export default MyApplicationsPage;
