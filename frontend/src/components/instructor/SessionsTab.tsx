import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import SessionFormDialog from "./SessionFormDialog";
import AttendanceDialog from "./AttendanceDialog";
import { getApiErrorMessage } from "../../services/api";
import {
  createSession,
  deleteSession,
  getCourseSessions,
  updateSession,
} from "../../services/instructorService";
import type { Session, SessionRequest } from "../../types/Lms";
import { formatDateTime } from "../../utils/formatDate";

function SessionsTab({ courseId }: { courseId: number }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Session | null>(null);
  const [formKey, setFormKey] = useState(0); // new key = fresh form
  const [attendanceFor, setAttendanceFor] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      setSessions(await getCourseSessions(courseId));
      setError("");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load sessions."));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    load();
  }, [load]);

  function openForm(session: Session | null) {
    setEditing(session);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }

  async function handleSave(payload: SessionRequest) {
    if (editing) await updateSession(editing.id, payload);
    else await createSession(courseId, payload);
    setFormOpen(false);
    await load();
  }

  async function handleDelete(session: Session) {
    if (!window.confirm(`Delete "${session.title}"?`)) return;
    try {
      await deleteSession(session.id);
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not delete the session."));
    }
  }

  if (loading) return <CircularProgress />;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Sessions</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => openForm(null)}
        >
          Add session
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {sessions.length === 0 ? (
        <Typography sx={{ color: "text.secondary" }}>
          No sessions yet.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Session</TableCell>
                <TableCell>When</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {s.title}
                    </Typography>
                    {s.description && (
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {s.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{formatDateTime(s.startTime)}</TableCell>
                  <TableCell>{s.location ?? "-"}</TableCell>
                  <TableCell>
                    {s.isPast ? (
                      <Chip
                        size="small"
                        label={
                          s.attendanceMarked > 0
                            ? "Attendance taken"
                            : "Needs attendance"
                        }
                        color={s.attendanceMarked > 0 ? "success" : "warning"}
                      />
                    ) : (
                      <Chip size="small" label="Upcoming" color="info" />
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    <Button
                      size="small"
                      color="secondary"
                      disabled={!s.isPast}
                      onClick={() => setAttendanceFor(s.id)}
                    >
                      Attendance
                    </Button>
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => openForm(s)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(s)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <SessionFormDialog
        key={formKey}
        open={formOpen}
        session={editing}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />

      {attendanceFor !== null && (
        <AttendanceDialog
          sessionId={attendanceFor}
          onClose={() => setAttendanceFor(null)}
          onSaved={load}
        />
      )}
    </>
  );
}

export default SessionsTab;
