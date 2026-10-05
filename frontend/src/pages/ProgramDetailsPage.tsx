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
  Paper,
} from "@mui/material";
import type { Program } from "../types/Program";
import type { ProgramDetails } from "../types/ProgramDetails";
import { getProgramById, getRelatedPrograms } from "../services/programService";
import ProgramCard from "../components/ProgramCard";
import InfoRow from "../components/InfoRow";
import { STATUS_LABELS } from "../utils/statusLabels";

const PLACEHOLDER_IMAGE = "https://placehold.co/1200x500?text=Program";

// Reads the id from the URL and gives each program its own fresh page
function ProgramDetailsPage() {
  const { id } = useParams();
  return <ProgramDetailsContent key={id} programId={Number(id)} />;
}

type ProgramDetailsContentProps = {
  programId: number;
};

function ProgramDetailsContent({ programId }: ProgramDetailsContentProps) {
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [relatedPrograms, setRelatedPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getProgramById(programId), getRelatedPrograms(programId)])
      .then(([programData, relatedData]) => {
        setProgram(programData);
        setRelatedPrograms(relatedData);
      })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError("This program does not exist.");
        } else {
          setError("Could not load this program. Please try again later.");
        }
      })
      .finally(() => setLoading(false));
  }, [programId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !program) {
    return (
      <Box sx={{ py: 8, px: 4, textAlign: "center" }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: "auto", mb: 3 }}>
          {error}
        </Alert>
        <Button
          component={Link}
          to="/programs"
          variant="contained"
          color="secondary"
        >
          Back to programs
        </Button>
      </Box>
    );
  }

  const totalHours = program.courses.reduce(
    (sum, course) => sum + course.durationHours,
    0,
  );

  return (
    <Box sx={{ py: 6, px: { xs: 2, md: 6 }, maxWidth: 1100, mx: "auto" }}>
      <Button component={Link} to="/programs" color="secondary" sx={{ mb: 2 }}>
        ← Back to programs
      </Button>

      {/* Image */}
      <Box
        component="img"
        src={program.imageUrl ?? PLACEHOLDER_IMAGE}
        alt={program.title}
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
        <Chip label={program.categoryName} />
        <Chip label={STATUS_LABELS[program.status]} color="secondary" />
      </Box>
      <Typography
        variant="h3"
        sx={{ mb: 2, fontSize: { xs: "2rem", md: "3rem" } }}
      >
        {program.title}
      </Typography>
      {program.shortDescription && (
        <Typography variant="h6" sx={{ color: "text.secondary", mb: 4 }}>
          {program.shortDescription}
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
        {/* Left: overview, requirements, program structure */}
        <Box sx={{ flex: "2 1 400px" }}>
          {program.overview && (
            <>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Overview
              </Typography>
              <Typography sx={{ mb: 4 }}>{program.overview}</Typography>
            </>
          )}

          {program.requirements && (
            <>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Requirements
              </Typography>
              <Typography sx={{ mb: 4 }}>{program.requirements}</Typography>
            </>
          )}

          <Typography variant="h5" sx={{ mb: 2 }}>
            Program structure
          </Typography>
          {program.courses.length === 0 ? (
            <Typography sx={{ color: "text.secondary", mb: 4 }}>
              Courses will be announced soon.
            </Typography>
          ) : (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}
            >
              {program.courses.map((course) => (
                <Paper
                  key={course.courseId}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Chip label={`Step ${course.sortOrder}`} color="secondary" />
                  <Box sx={{ flex: 1, minWidth: 160 }}>
                    <Typography variant="h6">{course.title}</Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {course.durationHours} hours
                    </Typography>
                  </Box>
                  <Button
                    component={Link}
                    to={`/courses/${course.courseId}`}
                    variant="outlined"
                    color="secondary"
                  >
                    View course
                  </Button>
                </Paper>
              ))}
            </Box>
          )}
        </Box>

        {/* Right: key information */}
        <Paper sx={{ flex: "1 1 280px", p: 3 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {program.price} EGP
          </Typography>
          {program.paymentInfo && (
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              {program.paymentInfo}
            </Typography>
          )}
          <InfoRow label="Duration" value={`${program.durationWeeks} weeks`} />
          <InfoRow
            label="Courses"
            value={`${program.courses.length} courses (${totalHours} hours)`}
          />
          <InfoRow label="Location" value={program.location} />
          <InfoRow label="Schedule" value={program.schedule} />
          <InfoRow label="Start date" value={program.startDate} />
          <InfoRow label="End date" value={program.endDate} />
          <InfoRow label="Capacity" value={`${program.capacity} students`} />

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

      {/* Related programs */}
      {relatedPrograms.length > 0 && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Related programs
          </Typography>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {relatedPrograms.map((related) => (
              <ProgramCard key={related.id} program={related} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ProgramDetailsPage;
