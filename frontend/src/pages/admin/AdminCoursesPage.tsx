import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { getApiErrorMessage } from "../../services/api";
import CourseEditorDialog from "../../components/admin/CourseEditorDialog";
import { assignInstructor, getAdminCourses, getAdminUsers } from "../../services/adminService";
import type { AdminUser } from "../../types/Admin";
import type { Course } from "../../types/Course";
import { STATUS_COLORS, STATUS_LABELS } from "../../utils/statusLabels";
import { formatDate } from "../../utils/formatDate";

function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<AdminUser[]>([]);
  const [selected, setSelected] = useState<Record<number, number | "">>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  // undefined = closed, null = new course, number = edit that course
  const [editingId, setEditingId] = useState<number | null | undefined>(undefined);

  const load = useCallback(async () => {
    try {
      const [list, people] = await Promise.all([
        getAdminCourses(),
        getAdminUsers({ role: "Instructor", isActive: true }),
      ]);
      setCourses(list);
      setInstructors(people);
      setSelected(Object.fromEntries(list.map((c) => [c.id, c.instructorId ?? ""])));
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load courses."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAssign(course: Course) {
    const instructorId = selected[course.id];
    if (!instructorId) return;

    setBusyId(course.id);
    setError("");
    setMessage("");
    try {
      await assignInstructor(course.id, instructorId);
      const name = instructors.find((i) => i.id === instructorId)?.fullName ?? null;
      setCourses((prev) =>
        prev.map((c) =>
          c.id === course.id ? { ...c, instructorId, instructorName: name } : c,
        ),
      );
      setMessage(`${name} now teaches "${course.title}".`);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not assign the instructor."));
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: { xs: 4, md: 6 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4">Manage courses</Typography>
        <Button variant="contained" color="secondary" onClick={() => setEditingId(null)}>
          New course
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Starts</TableCell>
              <TableCell sx={{ minWidth: 220 }}>Instructor</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((c) => {
              const value = selected[c.id] ?? "";
              const changed = value !== "" && value !== c.instructorId;
              return (
                <TableRow key={c.id}>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/courses/${c.id}`}
                      color="secondary"
                      sx={{ p: 0, textTransform: "none", fontWeight: 600 }}
                    >
                      {c.title}
                    </Button>
                    <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                      {c.categoryName} · {c.price} EGP
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={STATUS_LABELS[c.status]} color={STATUS_COLORS[c.status]} />
                  </TableCell>
                  <TableCell>{formatDate(c.startDate)}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      fullWidth
                      value={value}
                      onChange={(e) =>
                        setSelected((prev) => ({ ...prev, [c.id]: Number(e.target.value) }))
                      }
                    >
                      <MenuItem value="" disabled>
                        Choose instructor
                      </MenuItem>
                      {instructors.map((i) => (
                        <MenuItem key={i.id} value={i.id}>
                          {i.fullName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      disabled={!changed || busyId === c.id}
                      onClick={() => handleAssign(c)}
                    >
                      Assign
                    </Button>
                    <Button size="small" color="secondary" onClick={() => setEditingId(c.id)} sx={{ ml: 1 }}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {editingId !== undefined && (
        <CourseEditorDialog
          courseId={editingId}
          instructors={instructors}
          onClose={() => setEditingId(undefined)}
          onSaved={() => {
            setEditingId(undefined);
            setMessage("Course saved.");
            load();
          }}
        />
      )}
    </Container>
  );
}

export default AdminCoursesPage;
