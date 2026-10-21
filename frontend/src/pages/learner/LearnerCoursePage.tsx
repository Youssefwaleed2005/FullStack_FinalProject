import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  LinearProgress,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import LearnerOverviewTab from "../../components/learner/LearnerOverviewTab";
import LearnerSessionsTab from "../../components/learner/LearnerSessionsTab";
import LearnerMaterialsTab from "../../components/learner/LearnerMaterialsTab";
import LearnerAssignmentsTab from "../../components/learner/LearnerAssignmentsTab";
import { getApiErrorMessage } from "../../services/api";
import { getLearnerCourse } from "../../services/learnerService";
import type { LearnerCourseDetail } from "../../types/Learner";
import { STATUS_COLORS, STATUS_LABELS } from "../../utils/statusLabels";
import { formatDate } from "../../utils/formatDate";

function LearnerCoursePage() {
  const { id } = useParams();
  const courseId = Number(id);

  const [course, setCourse] = useState<LearnerCourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(0);

  // Also called after a submission, so the progress bar updates
  const loadCourse = useCallback(async () => {
    try {
      setCourse(await getLearnerCourse(courseId));
      setError("");
    } catch (err) {
      // 403 "not enrolled" / 404 "not found" messages come straight from the API
      setError(getApiErrorMessage(err, "Could not load the course."));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

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
        <Button component={Link} to="/my-enrollments" color="secondary">
          Back to my learning
        </Button>
      </Container>
    );
  }

  const progress = course.progress;

  return (
    <Container sx={{ py: { xs: 4, md: 6 } }}>
      <Button
        component={Link}
        to="/my-enrollments"
        color="secondary"
        sx={{ mb: 2 }}
      >
        ← Back to my learning
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
          {course.categoryName} · {course.durationHours} hours
          {course.programTitle ? ` · Part of ${course.programTitle}` : ""}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          {formatDate(course.startDate)} – {formatDate(course.endDate)}
          {course.schedule ? ` · ${course.schedule}` : ""}
          {course.location ? ` · ${course.location}` : ""}
        </Typography>

        {/* Progress */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Progress</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {progress.progressPercent}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress.progressPercent}
            color="secondary"
            sx={{ height: 8, borderRadius: 4, my: 0.5 }}
          />
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Attended {progress.attendedSessions}/{progress.pastSessions}{" "}
            sessions · Submitted {progress.submittedAssignments}/
            {progress.totalAssignments} assignments · Completed{" "}
            {progress.completedMaterials}/{progress.totalMaterials} materials
            {progress.averageScore !== null
              ? ` · Average score ${progress.averageScore}%`
              : ""}
          </Typography>
        </Box>

        {!course.canSubmit && (
          <Alert severity="info" sx={{ mt: 2 }}>
            This enrollment is {course.enrollmentStatus.toLowerCase()}, so the
            course is read-only.
          </Alert>
        )}
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
        <Tab label="Overview" />
        <Tab label="Sessions & attendance" />
        <Tab label="Materials" />
        <Tab label="Assignments" />
      </Tabs>

      {tab === 0 && <LearnerOverviewTab course={course} />}
      {tab === 1 && <LearnerSessionsTab courseId={courseId} />}
      {tab === 2 && (
        <LearnerMaterialsTab
          courseId={courseId}
          canComplete={course.canSubmit}
          onProgressChange={(p) =>
            setCourse((prev) => (prev ? { ...prev, progress: p } : prev))
          }
        />
      )}
      {tab === 3 && (
        <LearnerAssignmentsTab
          courseId={courseId}
          canSubmit={course.canSubmit}
          onSubmitted={loadCourse}
        />
      )}
    </Container>
  );
}

export default LearnerCoursePage;
