import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "text.primary",
        py: 10,
        textAlign: "center",
      }}
    >
      <Typography variant="h2" gutterBottom sx={{ fontWeight: "bold" }}>
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
