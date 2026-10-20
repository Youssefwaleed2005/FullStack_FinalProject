import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import StatCard from "../../components/StatCard";
import { getApiErrorMessage } from "../../services/api";
import {
  getInstructorDashboard,
  getMyTeachingCourses,
} from "../../services/instructorService";
import type {
  InstructorCourse,
  InstructorDashboard,
} from "../../types/Instructor";
import { STATUS_COLORS, STATUS_LABELS } from "../../utils/statusLabels";
import { formatDate, formatDateTime } from "../../utils/formatDate";

function InstructorDashboardPage() {
  const [dashboard, setDashboard] = useState<InstructorDashboard | null>(null);
  const [courses, setCourses] = useState<InstructorCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([getInstructorDashboard(), getMyTeachingCourses()])
      .then(([dash, myCourses]) => {
        if (!active) return;
        setDashboard(dash);
        setCourses(myCourses);
      })
      .catch((err) => {
        if (active)
          setError(getApiErrorMessage(err, "Could not load your dashboard."));
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

  if (error || !dashboard) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error || "Something went wrong."}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Instructor dashboard
      </Typography>

      {/* Numbers */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
        <StatCard label="My courses" value={dashboard.courseCount} />
        <StatCard label="Students" value={dashboard.studentCount} />
        <StatCard
          label="Upcoming sessions"
          value={dashboard.upcomingSessionCount}
        />
        <StatCard
          label="Waiting for grading"
          value={dashboard.pendingSubmissions}
          hint="Submitted assignments"
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          alignItems: "flex-start",
        }}
      >
        {/* Upcoming sessions */}
        <Paper sx={{ p: 3, flex: "1 1 320px" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Upcoming sessions
          </Typography>
          {dashboard.upcomingSessions.length === 0 ? (
            <Typography sx={{ color: "text.secondary" }}>
              No upcoming sessions.
            </Typography>
          ) : (
            <List disablePadding>
              {dashboard.upcomingSessions.map((s, i) => (
                <Box key={s.id}>
                  {i > 0 && <Divider />}
                  <ListItem
                    disableGutters
                    secondaryAction={
                      <Button
                        size="small"
                        component={Link}
                        to={`/instructor/courses/${s.courseId}`}
                        color="secondary"
                      >
                        Open
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={s.title}
                      secondary={`${s.courseTitle} · ${formatDateTime(s.startTime)}${
                        s.location ? ` · ${s.location}` : ""
                      }`}
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </Paper>

        {/* My courses */}
        <Box sx={{ flex: "2 1 480px" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            My courses
          </Typography>
          {courses.length === 0 ? (
            <Paper sx={{ p: 3 }}>
              <Typography sx={{ color: "text.secondary" }}>
                You are not assigned to any course yet.
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography variant="h6">{course.title}</Typography>
                      <Chip
                        size="small"
                        label={STATUS_LABELS[course.status]}
                        color={STATUS_COLORS[course.status]}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mt: 0.5 }}
                    >
                      {formatDate(course.startDate)} –{" "}
                      {formatDate(course.endDate)}
                      {course.location ? ` · ${course.location}` : ""}
                    </Typography>

                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, my: 2 }}
                    >
                      <Chip
                        size="small"
                        variant="outlined"
                        label={`${course.studentCount} / ${course.capacity} students`}
                      />
                      <Chip
                        size="small"
                        variant="outlined"
                        label={`${course.sessionCount} sessions`}
                      />
                      <Chip
                        size="small"
                        variant="outlined"
                        label={`${course.assignmentCount} assignments`}
                      />
                      {course.pendingSubmissions > 0 && (
                        <Chip
                          size="small"
                          color="warning"
                          label={`${course.pendingSubmissions} to grade`}
                        />
                      )}
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Next session:{" "}
                      {course.nextSessionAt
                        ? formatDateTime(course.nextSessionAt)
                        : "none planned"}
                    </Typography>

                    <Button
                      variant="contained"
                      color="secondary"
                      component={Link}
                      to={`/instructor/courses/${course.id}`}
                    >
                      Manage course
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default InstructorDashboardPage;
