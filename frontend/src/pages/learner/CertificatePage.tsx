import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Container, GlobalStyles, Typography } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LockIcon from "@mui/icons-material/Lock";
import PrintIcon from "@mui/icons-material/Print";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../services/api";
import { getLearnerCourse } from "../../services/learnerService";
import type { LearnerCourseDetail } from "../../types/Learner";
import { formatDate } from "../../utils/formatDate";

const INK = "#3b2a1a";
const GOLD = "#c8955c";
const MUTED = "#6b5440";

// Certificate of completion for a course the learner finished (100% progress).
// "Print / save as PDF" opens the browser's print dialog; the print styles hide everything else.
function CertificatePage() {
  const { id } = useParams();
  const courseId = Number(id);
  const { user } = useAuth();
  const [course, setCourse] = useState<LearnerCourseDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getLearnerCourse(courseId)
      .then((data) => active && setCourse(data))
      .catch((err: unknown) => active && setError(getApiErrorMessage(err)));
    return () => {
      active = false;
    };
  }, [courseId]);

  const back = (
    <Button component={Link} to={`/learning/courses/${courseId}`} color="secondary">
      ← Back to the course
    </Button>
  );

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        {back}
      </Container>
    );
  }
  if (!course) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (course.progress.progressPercent < 100) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <LockIcon sx={{ fontSize: 56, color: "secondary.main", opacity: 0.6 }} />
        <Typography variant="h5" sx={{ mt: 2 }}>Not unlocked yet</Typography>
        <Typography sx={{ color: "text.secondary", mt: 1, mb: 3 }}>
          Your certificate appears when you reach 100% in "{course.title}". You're at{" "}
          {course.progress.progressPercent}% — keep going!
        </Typography>
        {back}
      </Container>
    );
  }

  const learnerName = user ? `${user.firstName} ${user.lastName}` : "Learner";
  // The course end date once it has passed, otherwise today (finished early)
  const today = new Date().toISOString();
  const issued = formatDate(course.endDate && course.endDate < today ? course.endDate : today);
  const certificateId = `AA-${String(course.id).padStart(3, "0")}-${String(user?.id ?? 0).padStart(4, "0")}`;

  return (
    <Container sx={{ py: { xs: 4, md: 6 } }}>
      <GlobalStyles
        styles={{
          "@media print": {
            "@page": { size: "A4 landscape", margin: 0 },
            "body *": { visibility: "hidden" },
            "#certificate, #certificate *": { visibility: "visible" },
            "#certificate": {
              position: "fixed",
              inset: 0,
              width: "100%",
              height: "100%",
              margin: 0,
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            },
          },
        }}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 3, "@media print": { display: "none" } }}>
        {back}
        <Button variant="contained" color="secondary" startIcon={<PrintIcon />} onClick={() => window.print()}>
          Print / save as PDF
        </Button>
      </Box>

      {/* The certificate itself (landscape A4 proportions) */}
      <Box
        component="article"
        id="certificate"
        aria-label={`Certificate of completion for ${learnerName}`}
        sx={{
          position: "relative",
          mx: "auto",
          maxWidth: 1000,
          aspectRatio: "1.414",
          border: `10px double ${GOLD}`,
          borderRadius: 3,
          bgcolor: "#fffaf2",
          color: INK,
          boxShadow: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: "center",
          px: { xs: 3, sm: 8 },
          py: { xs: 3, sm: 6 },
        }}
      >
        <Box aria-hidden sx={{ position: "absolute", inset: { xs: 12, sm: 20 }, border: `1px solid ${GOLD}66`, borderRadius: 2, pointerEvents: "none" }} />

        <Box>
          <Typography sx={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: { xs: 18, sm: 26 }, color: "#7a4f2a" }}>
            Andalusia Academy
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: { xs: 10, sm: 13 }, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: "#9a6a3a" }}>
            Certificate of completion
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography sx={{ color: MUTED, fontSize: { xs: 12, sm: 16 } }}>This certifies that</Typography>
          <Typography sx={{ fontFamily: "Georgia, serif", fontWeight: 600, fontSize: { xs: 26, sm: 46 }, mt: 1 }}>
            {learnerName}
          </Typography>
          <Box aria-hidden sx={{ height: "1px", width: { xs: 160, sm: 300 }, bgcolor: GOLD, my: { xs: 1, sm: 2 } }} />
          <Typography sx={{ color: MUTED, fontSize: { xs: 12, sm: 16 } }}>has successfully completed the course</Typography>
          <Typography sx={{ fontFamily: "Georgia, serif", fontWeight: 600, color: "#7a4f2a", fontSize: { xs: 18, sm: 30 }, mt: 1 }}>
            {course.title}
          </Typography>
          <Typography sx={{ color: MUTED, fontSize: { xs: 11, sm: 14 }, mt: 1 }}>
            {course.durationHours} hours · {course.categoryName}
            {course.progress.averageScore !== null ? ` · Average score ${course.progress.averageScore}%` : ""}
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "end", gap: 3, width: "100%", fontSize: { xs: 11, sm: 14 } }}>
          <Box>
            <Typography sx={{ fontWeight: 500, fontSize: "inherit" }}>{issued}</Typography>
            <Typography sx={{ borderTop: `1px solid ${GOLD}`, pt: 0.5, mt: 0.5, color: MUTED, fontSize: "inherit" }}>Date</Typography>
          </Box>
          <Box sx={{ width: { xs: 48, sm: 80 }, height: { xs: 48, sm: 80 }, borderRadius: "50%", border: `2px solid ${GOLD}`, bgcolor: `${GOLD}26`, display: "flex", alignItems: "center", justifyContent: "center", color: "#7a4f2a" }}>
            <EmojiEventsIcon aria-hidden sx={{ fontSize: { xs: 24, sm: 40 } }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 500, fontSize: "inherit" }}>
              {course.instructor?.fullName ?? "Andalusia Academy"}
            </Typography>
            <Typography sx={{ borderTop: `1px solid ${GOLD}`, pt: 0.5, mt: 0.5, color: MUTED, fontSize: "inherit" }}>Instructor</Typography>
          </Box>
        </Box>

        <Typography sx={{ fontSize: { xs: 9, sm: 12 }, letterSpacing: "0.05em", color: "#9a8470" }}>
          Certificate ID {certificateId}
        </Typography>
      </Box>
    </Container>
  );
}

export default CertificatePage;
