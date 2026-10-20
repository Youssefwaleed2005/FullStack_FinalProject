import { Avatar, Box, Link as MuiLink, Paper, Typography } from "@mui/material";
import type { LearnerCourseDetail } from "../../types/Learner";

function LearnerOverviewTab({ course }: { course: LearnerCourseDetail }) {
  const instructor = course.instructor;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
      }}
    >
      <Paper sx={{ p: 3, flex: 2 }}>
        <Typography variant="h6" gutterBottom>
          About this course
        </Typography>
        <Typography sx={{ whiteSpace: "pre-line" }}>
          {course.fullDescription ??
            course.shortDescription ??
            "No description yet."}
        </Typography>

        {course.objectives && (
          <>
            <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
              What you'll learn
            </Typography>
            <Typography sx={{ whiteSpace: "pre-line" }}>
              {course.objectives}
            </Typography>
          </>
        )}
      </Paper>

      <Paper sx={{ p: 3, flex: 1, alignSelf: { md: "flex-start" } }}>
        <Typography variant="h6" gutterBottom>
          Instructor
        </Typography>
        {instructor ? (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Avatar src={instructor.photoUrl ?? undefined}>
                {instructor.fullName.charAt(0)}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600 }}>
                  {instructor.fullName}
                </Typography>
                {instructor.specialization && (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {instructor.specialization}
                  </Typography>
                )}
              </Box>
            </Box>
            <MuiLink
              href={`mailto:${instructor.email}`}
              color="secondary"
              variant="body2"
              sx={{ wordBreak: "break-all" }}
            >
              {instructor.email}
            </MuiLink>
            {instructor.bio && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {instructor.bio}
              </Typography>
            )}
          </>
        ) : (
          <Typography sx={{ color: "text.secondary" }}>
            No instructor assigned yet.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default LearnerOverviewTab;
