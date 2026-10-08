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
} from "@mui/material";
import type { CareerPathDetails } from "../types/CareerPathDetails";
import { getCareerPathById } from "../services/CareerPathService";
import ProgramCard from "../components/ProgramCard";
import CourseCard from "../components/CourseCard";

// Reads the id from the URL and gives each career path its own fresh page
function CareerPathDetailsPage() {
  const { id } = useParams();
  return <CareerPathDetailsContent key={id} careerPathId={Number(id)} />;
}

type CareerPathDetailsContentProps = {
  careerPathId: number;
};

function CareerPathDetailsContent({
  careerPathId,
}: CareerPathDetailsContentProps) {
  const [careerPath, setCareerPath] = useState<CareerPathDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCareerPathById(careerPathId)
      .then((data) => setCareerPath(data))
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError("This career path does not exist.");
        } else {
          setError("Could not load this career path. Please try again later.");
        }
      })
      .finally(() => setLoading(false));
  }, [careerPathId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !careerPath) {
    return (
      <Box sx={{ py: 8, px: { xs: 2, md: 4 }, textAlign: "center" }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: "auto", mb: 3 }}>
          {error}
        </Alert>
        <Button
          component={Link}
          to="/career-paths"
          variant="contained"
          color="secondary"
        >
          Back to career paths
        </Button>
      </Box>
    );
  }

  const skills = careerPath.recommendedSkills
    ? careerPath.recommendedSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "")
    : [];

  return (
    <Box sx={{ py: 6, px: { xs: 2, md: 6 }, maxWidth: 1100, mx: "auto" }}>
      <Button
        component={Link}
        to="/career-paths"
        color="secondary"
        sx={{ mb: 2 }}
      >
        ← Back to career paths
      </Button>

      {/* Title */}
      <Typography
        variant="h3"
        sx={{ mb: 2, fontSize: { xs: "2rem", md: "3rem" } }}
      >
        {careerPath.title}
      </Typography>
      {careerPath.shortDescription && (
        <Typography variant="h6" sx={{ color: "text.secondary", mb: 4 }}>
          {careerPath.shortDescription}
        </Typography>
      )}

      {/* Overview */}
      {careerPath.overview && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Career overview
          </Typography>
          <Typography>{careerPath.overview}</Typography>
        </Box>
      )}

      {/* Recommended skills */}
      {skills.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Recommended skills
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {skills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                color="secondary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Recommended programs (learning journey) */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Recommended programs
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 3 }}>
          Follow these programs in order to build the skills for this career.
        </Typography>
        {careerPath.programs.length === 0 ? (
          <Typography sx={{ color: "text.secondary" }}>
            Programs will be announced soon.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {careerPath.programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </Box>
        )}
      </Box>

      {/* Recommended courses */}
      {careerPath.recommendedCourses.length > 0 && (
        <Box>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Recommended courses
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 3 }}>
            The courses included in the recommended programs, in learning order.
          </Typography>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {careerPath.recommendedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default CareerPathDetailsPage;
