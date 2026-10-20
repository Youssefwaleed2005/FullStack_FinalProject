import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { getApiErrorMessage } from "../../services/api";
import {
  getSessionAttendance,
  markAttendance,
} from "../../services/instructorService";
import type { SessionAttendance } from "../../types/Instructor";
import type { AttendanceStatus } from "../../types/Lms";
import { formatDateTime } from "../../utils/formatDate";

const STATUSES: AttendanceStatus[] = ["Present", "Late", "Absent", "Excused"];

type Props = {
  sessionId: number;
  onClose: () => void;
  onSaved: () => void;
};

function AttendanceDialog({ sessionId, onClose, onSaved }: Props) {
  const [roster, setRoster] = useState<SessionAttendance | null>(null);
  const [statuses, setStatuses] = useState<
    Record<number, AttendanceStatus | null>
  >({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    getSessionAttendance(sessionId)
      .then((data) => {
        if (!active) return;
        setRoster(data);
        setStatuses(
          Object.fromEntries(data.students.map((s) => [s.userId, s.status])),
        );
      })
      .catch((err) => {
        if (active)
          setError(getApiErrorMessage(err, "Could not load attendance."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [sessionId]);

  function markAllPresent() {
    if (!roster) return;
    setStatuses(
      Object.fromEntries(
        roster.students.map((s) => [s.userId, "Present" as const]),
      ),
    );
  }

  async function handleSave() {
    const records = Object.entries(statuses)
      .filter(([, status]) => status !== null)
      .map(([userId, status]) => ({ userId: Number(userId), status: status! }));

    if (records.length === 0) {
      setError("Choose a status for at least one student.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      const updated = await markAttendance(sessionId, { records });
      setRoster(updated);
      setSaved(true);
      onSaved();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save attendance."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Attendance
        {roster && (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {roster.sessionTitle} · {formatDateTime(roster.startTime)}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent dividers>
        {loading && <CircularProgress />}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {saved && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Attendance saved.
          </Alert>
        )}

        {roster && roster.students.length === 0 && (
          <Typography sx={{ color: "text.secondary" }}>
            No students enrolled.
          </Typography>
        )}

        {roster && roster.students.length > 0 && (
          <>
            <Button
              size="small"
              color="secondary"
              onClick={markAllPresent}
              sx={{ mb: 1 }}
            >
              Mark all present
            </Button>
            {roster.students.map((student, i) => (
              <Box key={student.userId}>
                {i > 0 && <Divider />}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                    py: 1.5,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      {student.fullName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {student.email}
                    </Typography>
                  </Box>
                  <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={statuses[student.userId] ?? null}
                    onChange={(_, value: AttendanceStatus | null) =>
                      setStatuses((prev) => ({
                        ...prev,
                        [student.userId]: value,
                      }))
                    }
                  >
                    {STATUSES.map((status) => (
                      <ToggleButton key={status} value={status}>
                        {status}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>
              </Box>
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSave}
          disabled={
            saving || loading || !roster || roster.students.length === 0
          }
        >
          {saving ? "Saving..." : "Save attendance"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AttendanceDialog;
