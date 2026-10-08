import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "text.primary",
        py: { xs: 6, md: 10 },
        px: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h2" gutterBottom sx={{ fontWeight: "bold", fontSize: { xs: "2.25rem", md: "3.75rem" } }}>
        Learn Without Limits
      </Typography>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Explore courses, programs and career paths taught by industry experts.
      </Typography>
      <Link to="/courses" style={{ textDecoration: "none" }}>
        <Button variant="contained" color="secondary" size="large">
          Explore Courses
        </Button>
      </Link>
    </Box>
  );
}

export default HeroSection;
