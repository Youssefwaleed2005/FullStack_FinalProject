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
import AssignmentFormDialog from "./AssignmentFormDialog";
import SubmissionsDialog from "./SubmissionsDialog";
import { getApiErrorMessage } from "../../services/api";
import {
  createAssignment,
  deleteAssignment,
  getCourseAssignments,
  updateAssignment,
} from "../../services/instructorService";
import type { Assignment, AssignmentRequest } from "../../types/Lms";
import { formatDateTime } from "../../utils/formatDate";

function AssignmentsTab({ courseId }: { courseId: number }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [viewing, setViewing] = useState<Assignment | null>(null);

  const load = useCallback(async () => {
    try {
      setAssignments(await getCourseAssignments(courseId));
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

  function openForm(assignment: Assignment | null) {
    setEditing(assignment);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }

  async function handleSave(payload: AssignmentRequest) {
    if (editing) await updateAssignment(editing.id, payload);
    else await createAssignment(courseId, payload);
    setFormOpen(false);
    await load();
  }

  async function handleDelete(assignment: Assignment) {
    if (!window.confirm(`Delete "${assignment.title}"?`)) return;
    try {
      await deleteAssignment(assignment.id);
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not delete the assignment."));
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
        <Typography variant="h6">Assignments</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => openForm(null)}
        >
          Add assignment
        </Button>
      </Box>

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
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Assignment</TableCell>
                <TableCell>Due</TableCell>
                <TableCell align="center">Max</TableCell>
                <TableCell align="center">Submissions</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((a) => {
                const toGrade = a.submissionCount - a.gradedCount;
                return (
                  <TableRow key={a.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {a.title}
                      </Typography>
                      {a.isPastDue && (
                        <Chip size="small" label="Past due" sx={{ mt: 0.5 }} />
                      )}
                    </TableCell>
                    <TableCell>{formatDateTime(a.dueDate)}</TableCell>
                    <TableCell align="center">{a.maxScore}</TableCell>
                    <TableCell align="center">
                      {a.submissionCount}
                      {toGrade > 0 && (
                        <Chip
                          size="small"
                          color="warning"
                          label={`${toGrade} to grade`}
                          sx={{ ml: 1 }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <Button
                        size="small"
                        color="secondary"
                        onClick={() => setViewing(a)}
                      >
                        Submissions
                      </Button>
                      <Button
                        size="small"
                        color="secondary"
                        onClick={() => openForm(a)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(a)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <AssignmentFormDialog
        key={formKey}
        open={formOpen}
        assignment={editing}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />

      {viewing && (
        <SubmissionsDialog
          assignment={viewing}
          onClose={() => setViewing(null)}
          onGraded={load}
        />
      )}
    </>
  );
}

export default AssignmentsTab;
