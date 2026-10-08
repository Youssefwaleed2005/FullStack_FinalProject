import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import type { Course } from "../types/Course";
import { getCourses } from "../services/courseService";
import CourseCard from "./CourseCard";

function FeaturedCoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCourses({ isFeatured: true, pageSize: 3 })
      .then((page) => setCourses(page.items))
      .catch(() => setError("Could not load courses. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
        Featured courses
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ maxWidth: 600, mx: "auto" }}>
          {error}
        </Alert>
      )}

      {!loading && !error && courses.length === 0 && (
        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
          No featured courses yet.
        </Typography>
      )}

      {!loading && !error && courses.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: "center",
          }}
        >
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default FeaturedCoursesSection;
