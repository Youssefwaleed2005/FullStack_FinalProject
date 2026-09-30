import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import type { CareerPath } from "../types/CareerPath";

const careerPaths: CareerPath[] = [
  {
    id: 1,
    title: "Full Stack Developer",
    description: "Front-end, back-end and databases .",
    courseCount: 6,
  },
  {
    id: 2,
    title: "Data Analyst",
    description: "Turn raw data into reporting and insight.         ",
    courseCount: 4,
  },
  {
    id: 3,
    title: "UI/UX Designer",
    description: "Research and interface design.",
    courseCount: 5,
  },
];

function CareerPathsSection() {
  return (
    <Box sx={{ py: 8, px: 4 }}>
      <Typography variant="h4" sx={{ mb: 1, textAlign: "center" }}>
        Discover your career path
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 4, textAlign: "center", color: "text.secondary" }}
      >
        Follow a guided track instead of picking courses one by one.
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
        }}
      >
        {careerPaths.map((path) => (
          <Card key={path.id} sx={{ width: 300 }}>
            <CardContent>
              <Typography variant="h6">{path.title}</Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 2 }}
              >
                {path.description}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {path.courseCount} courses
              </Typography>
              <Button variant="outlined" fullWidth>
                View path
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default CareerPathsSection;
