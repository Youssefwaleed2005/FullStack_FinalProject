import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import StudentsTab from "../../components/instructor/StudentsTab";
import SessionsTab from "../../components/instructor/SessionsTab";
import MaterialsTab from "../../components/instructor/MaterialsTab";
import AssignmentsTab from "../../components/instructor/AssignmentsTab";
import { getApiErrorMessage } from "../../services/api";
import { getMyTeachingCourses } from "../../services/instructorService";
import type { InstructorCourse } from "../../types/Instructor";
import { STATUS_COLORS, STATUS_LABELS } from "../../utils/statusLabels";
import { formatDate } from "../../utils/formatDate";

function InstructorCoursePage() {
  const { id } = useParams();
  const courseId = Number(id);

  const [course, setCourse] = useState<InstructorCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(0);

  useEffect(() => {
    let active = true;
    // Only courses I teach are returned, so "not found" also means "not mine"
    getMyTeachingCourses()
      .then((courses) => {
        if (!active) return;
        const found = courses.find((c) => c.id === courseId);
        if (found) setCourse(found);
        else setError("This course was not found, or you don't teach it.");
      })
      .catch((err) => {
        if (active)
          setError(getApiErrorMessage(err, "Could not load the course."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [courseId]);

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !course) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button component={Link} to="/instructor" color="secondary">
          Back to dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: { xs: 4, md: 6 } }}>
      <Button
        component={Link}
        to="/instructor"
        color="secondary"
        sx={{ mb: 2 }}
      >
        ← Back to dashboard
      </Button>

      {/* Course header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="h4">{course.title}</Typography>
          <Chip
            label={STATUS_LABELS[course.status]}
            color={STATUS_COLORS[course.status]}
          />
        </Box>
        <Typography sx={{ color: "text.secondary", mt: 1 }}>
          {formatDate(course.startDate)} – {formatDate(course.endDate)}
          {course.schedule ? ` · ${course.schedule}` : ""}
          {course.location ? ` · ${course.location}` : ""}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          {course.studentCount} / {course.capacity} students
        </Typography>
      </Paper>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        textColor="secondary"
        indicatorColor="secondary"
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{ mb: 3 }}
      >
        <Tab label="Students" />
        <Tab label="Sessions & attendance" />
        <Tab label="Materials" />
        <Tab label="Assignments" />
      </Tabs>

      {tab === 0 && <StudentsTab courseId={courseId} />}
      {tab === 1 && <SessionsTab courseId={courseId} />}
      {tab === 2 && <MaterialsTab courseId={courseId} />}
      {tab === 3 && <AssignmentsTab courseId={courseId} />}
    </Container>
  );
}

export default InstructorCoursePage;
