import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getApiErrorMessage } from "../../services/api";
import { getCourseStudents } from "../../services/instructorService";
import type { CourseStudent } from "../../types/Instructor";
import { formatDate } from "../../utils/formatDate";

function StudentsTab({ courseId }: { courseId: number }) {
  const [students, setStudents] = useState<CourseStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getCourseStudents(courseId)
      .then((data) => {
        if (active) setStudents(data);
      })
      .catch((err) => {
        if (active)
          setError(getApiErrorMessage(err, "Could not load students."));
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
  if (students.length === 0)
    return (
      <Typography sx={{ color: "text.secondary" }}>
        No students enrolled yet.
      </Typography>
    );

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell>Enrolled</TableCell>
            <TableCell align="center">Attendance</TableCell>
            <TableCell align="center">Assignments</TableCell>
            <TableCell align="center">Average</TableCell>
            <TableCell sx={{ minWidth: 160 }}>Progress</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((s) => (
            <TableRow key={s.userId}>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {s.fullName}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {s.email}
                </Typography>
              </TableCell>
              <TableCell>{formatDate(s.enrolledAt)}</TableCell>
              <TableCell align="center">
                {s.attendedSessions} / {s.pastSessions}
              </TableCell>
              <TableCell align="center">
                {s.submittedAssignments} / {s.totalAssignments}
              </TableCell>
              <TableCell align="center">
                {s.averageScore !== null ? `${s.averageScore}%` : "-"}
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={s.progressPercent}
                    color="secondary"
                    sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2">{s.progressPercent}%</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StudentsTab;
