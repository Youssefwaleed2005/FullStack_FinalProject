import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import StatCard from "../../components/StatCard";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../services/api";
import { getLearnerDashboard } from "../../services/learnerService";
import type { LearnerDashboard } from "../../types/Learner";
import { formatDateTime } from "../../utils/formatDate";

const PLACEHOLDER_IMAGE = "https://placehold.co/600x300?text=Course";

function LearnerDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<LearnerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getLearnerDashboard()
      .then((d) => {
        if (active) setData(d);
      })
      .catch((err) => {
        if (active) setError(getApiErrorMessage(err, "Could not load your dashboard."));
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

  if (error || !data) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error || "Something went wrong."}</Alert>
      </Container>
    );
  }

  const activeCourses = data.courses.filter((c) => c.enrollmentStatus === "Active");
  const otherCourses = data.courses.filter((c) => c.enrollmentStatus !== "Active");

  return (
    <Container sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="h4">Welcome back, {user?.firstName}!</Typography>
      <Typography sx={{ color: "text.secondary", mb: 3 }}>
        Here is what's happening in your courses.
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
        <StatCard label="Active courses" value={data.activeCourseCount} />
        <StatCard label="Average progress" value={`${data.averageProgress}%`} />
        <StatCard label="Upcoming sessions" value={data.upcomingSessionCount} />
        <StatCard label="Assignments to do" value={data.pendingAssignmentCount} hint="Not submitted yet" />
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "flex-start" }}>
        {/* Continue learning */}
        <Box sx={{ flex: "2 1 480px" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Continue learning
          </Typography>

          {data.courses.length === 0 ? (
            <Paper sx={{ p: 3 }}>
              <Typography sx={{ mb: 2 }}>You are not enrolled in any course yet.</Typography>
              <Button component={Link} to="/courses" variant="contained" color="secondary">
                Browse courses
              </Button>
            </Paper>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              {[...activeCourses, ...otherCourses].map((course) => (
                <Card key={course.id} sx={{ display: "flex", flexDirection: "column" }}>
                  <CardMedia
                    component="img"
                    height="120"
                    image={course.imageUrl ?? PLACEHOLDER_IMAGE}
                    alt={course.title}
                  />
                  <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography variant="h6" sx={{ lineHeight: 1.3 }}>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                      {course.instructorName ?? "Instructor to be announced"}
                      {course.programTitle ? ` · ${course.programTitle}` : ""}
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: "auto" }}>
                      <Typography variant="body2">Progress</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {course.progressPercent}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={course.progressPercent}
                      color="secondary"
                      sx={{ height: 8, borderRadius: 4, my: 0.5 }}
                    />

                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 1 }}>
                      {course.enrollmentStatus !== "Active" && (
                        <Chip size="small" label={course.enrollmentStatus} />
                      )}
                      {course.pendingAssignments > 0 && (
                        <Chip size="small" color="warning" label={`${course.pendingAssignments} to submit`} />
                      )}
                    </Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", mb: 1.5 }}>
                      Next session: {course.nextSessionAt ? formatDateTime(course.nextSessionAt) : "none planned"}
                    </Typography>

                    <Button
                      variant="contained"
                      color="secondary"
                      component={Link}
                      to={`/learning/courses/${course.id}`}
                    >
                      {course.progressPercent > 0 ? "Continue" : "Start"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        {/* Upcoming sessions */}
        <Paper sx={{ p: 3, flex: "1 1 280px" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Upcoming sessions
          </Typography>
          {data.upcomingSessions.length === 0 ? (
            <Typography sx={{ color: "text.secondary" }}>No upcoming sessions.</Typography>
          ) : (
            <List disablePadding>
              {data.upcomingSessions.map((s, i) => (
                <Box key={s.id}>
                  {i > 0 && <Divider />}
                  <ListItem disableGutters>
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
          <Button component={Link} to="/my-enrollments" color="secondary" sx={{ mt: 1 }}>
            All my enrollments →
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

export default LearnerDashboardPage;
