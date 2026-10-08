import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Avatar,
  Paper,
} from "@mui/material";
import type { Course } from "../types/Course";
import type { CourseDetails } from "../types/CourseDetails";
import { getCourseById, getRelatedCourses } from "../services/courseService";
import CourseCard from "../components/CourseCard";
import InfoRow from "../components/InfoRow";
import { STATUS_LABELS } from "../utils/statusLabels";

const PLACEHOLDER_IMAGE = "https://placehold.co/1200x500?text=Course";

// Reads the id from the URL and gives each course its own fresh page
function CourseDetailsPage() {
  const { id } = useParams();
  return <CourseDetailsContent key={id} courseId={Number(id)} />;
}

type CourseDetailsContentProps = {
  courseId: number;
};

function CourseDetailsContent({ courseId }: CourseDetailsContentProps) {
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getCourseById(courseId), getRelatedCourses(courseId)])
      .then(([courseData, relatedData]) => {
        setCourse(courseData);
        setRelatedCourses(relatedData);
      })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError("This course does not exist.");
        } else {
          setError("Could not load this course. Please try again later.");
        }
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !course) {
    return (
      <Box sx={{ py: 8, px: { xs: 2, md: 4 }, textAlign: "center" }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: "auto", mb: 3 }}>
          {error}
        </Alert>
        <Button
          component={Link}
          to="/courses"
          variant="contained"
          color="secondary"
        >
          Back to courses
        </Button>
      </Box>
    );
  }

  const objectives = course.objectives
    ? course.objectives.split("\n").filter((line) => line.trim() !== "")
    : [];

  return (
    <Box sx={{ py: 6, px: { xs: 2, md: 6 }, maxWidth: 1100, mx: "auto" }}>
      <Button component={Link} to="/courses" color="secondary" sx={{ mb: 2 }}>
        ← Back to courses
      </Button>

      {/* Image */}
      <Box
        component="img"
        src={course.imageUrl ?? PLACEHOLDER_IMAGE}
        alt={course.title}
        sx={{
          width: "100%",
          maxHeight: 360,
          objectFit: "cover",
          borderRadius: 2,
          mb: 3,
        }}
      />

      {/* Title and chips */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
        <Chip label={course.categoryName} />
        <Chip label={STATUS_LABELS[course.status]} color="secondary" />
        <Chip label={course.type} variant="outlined" />
      </Box>
      <Typography
        variant="h3"
        sx={{ mb: 2, fontSize: { xs: "2rem", md: "3rem" } }}
      >
        {course.title}
      </Typography>
      {course.shortDescription && (
        <Typography variant="h6" sx={{ color: "text.secondary", mb: 4 }}>
          {course.shortDescription}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        {/* Left: description, objectives, instructor */}
        <Box sx={{ flex: "2 1 400px" }}>
          {course.fullDescription && (
            <>
              <Typography variant="h5" sx={{ mb: 1 }}>
                About this course
              </Typography>
              <Typography sx={{ mb: 4 }}>{course.fullDescription}</Typography>
            </>
          )}

          {objectives.length > 0 && (
            <>
              <Typography variant="h5" sx={{ mb: 1 }}>
                What you will learn
              </Typography>
              <Box component="ul" sx={{ mt: 0, mb: 4 }}>
                {objectives.map((objective) => (
                  <li key={objective}>
                    <Typography>{objective}</Typography>
                  </li>
                ))}
              </Box>
            </>
          )}

          {course.instructorName && (
            <>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Instructor
              </Typography>
              <Box
                sx={{ display: "flex", gap: 2, alignItems: "center", mb: 4 }}
              >
                <Avatar
                  src={course.instructorPhotoUrl ?? undefined}
                  alt={course.instructorName}
                  sx={{ width: 64, height: 64 }}
                >
                  {course.instructorName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{course.instructorName}</Typography>
                  {course.instructorBio && (
                    <Typography sx={{ color: "text.secondary" }}>
                      {course.instructorBio}
                    </Typography>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Box>

        {/* Right: key information */}
        <Paper sx={{ flex: "1 1 280px", p: 3 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {course.price} EGP
          </Typography>
          <InfoRow label="Duration" value={`${course.durationHours} hours`} />
          <InfoRow label="Location" value={course.location} />
          <InfoRow label="Schedule" value={course.schedule} />
          <InfoRow label="Start date" value={course.startDate} />
          <InfoRow label="End date" value={course.endDate} />
          <InfoRow label="Capacity" value={`${course.capacity} students`} />

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            disabled
            sx={{ mt: 2 }}
          >
            Apply now
          </Button>
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 1, color: "text.secondary" }}
          >
            Applications open in a later release.
          </Typography>
        </Paper>
      </Box>

      {/* Related courses */}
      {relatedCourses.length > 0 && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Related courses
          </Typography>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {relatedCourses.map((related) => (
              <CourseCard key={related.id} course={related} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default CourseDetailsPage;
