import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { getApiErrorMessage } from "../../services/api";
import { getLearnerSessions } from "../../services/learnerService";
import type { LearnerSession } from "../../types/Learner";
import type { AttendanceStatus } from "../../types/Lms";
import { formatDateTime } from "../../utils/formatDate";

const ATTENDANCE_COLORS: Record<
  AttendanceStatus,
  "success" | "warning" | "error" | "default"
> = {
  Present: "success",
  Late: "warning",
  Absent: "error",
  Excused: "default",
};

function SessionStatusChip({ session }: { session: LearnerSession }) {
  if (!session.isPast)
    return <Chip size="small" label="Upcoming" color="info" />;
  if (!session.myAttendance)
    return <Chip size="small" label="Not marked yet" variant="outlined" />;
  return (
    <Chip
      size="small"
      label={session.myAttendance}
      color={ATTENDANCE_COLORS[session.myAttendance]}
    />
  );
}

function LearnerSessionsTab({ courseId }: { courseId: number }) {
  const [sessions, setSessions] = useState<LearnerSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getLearnerSessions(courseId)
      .then((data) => {
        if (active) setSessions(data);
      })
      .catch((err) => {
        if (active)
          setError(getApiErrorMessage(err, "Could not load sessions."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [courseId]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (sessions.length === 0) {
    return (
      <Typography sx={{ color: "text.secondary" }}>
        No sessions scheduled yet.
      </Typography>
    );
  }

  const past = sessions.filter((s) => s.isPast);
  const attended = past.filter(
    (s) => s.myAttendance === "Present" || s.myAttendance === "Late",
  ).length;

  return (
    <>
      <Typography variant="h6">Sessions</Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        You attended {attended} of {past.length} past sessions.
      </Typography>

      <Paper>
        {sessions.map((s, i) => (
          <Box key={s.id}>
            {i > 0 && <Divider />}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                p: 2,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600 }}>{s.title}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {formatDateTime(s.startTime)}
                  {s.location ? ` · ${s.location}` : ""}
                </Typography>
                {s.description && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {s.description}
                  </Typography>
                )}
              </Box>
              <SessionStatusChip session={s} />
            </Box>
          </Box>
        ))}
      </Paper>
    </>
  );
}

export default LearnerSessionsTab;
