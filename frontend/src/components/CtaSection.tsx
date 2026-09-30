import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

function CtaSection() {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "primary.contrastText",
        py: 8,
        px: 4,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Ready to start learning?
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Browse our catalog and enrol in a course today.
      </Typography>
      <Link to="/courses" style={{ textDecoration: "none" }}>
        <Button variant="contained" color="secondary" size="large">
          Browse courses
        </Button>
      </Link>
    </Box>
  );
}

export default CtaSection;
