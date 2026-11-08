import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CourseCard from "../components/CourseCard";
import { useWishlist } from "../hooks/useWishlist";

// Courses saved with the heart button; stored in this browser
function SavedCoursesPage() {
  const saved = useWishlist();

  return (
    <Box sx={{ py: 6, px: { xs: 2, md: 6 }, maxWidth: 1100, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Your saved courses
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 4 }}>
        Courses you saved with the heart. They're kept on this device so you can compare them before applying.
      </Typography>

      {saved.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <FavoriteBorderIcon sx={{ fontSize: 56, color: "secondary.main", opacity: 0.6 }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Nothing saved yet
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 3 }}>
            Tap the heart on any course to keep it here for later.
          </Typography>
          <Button variant="contained" color="secondary" component={Link} to="/courses">
            Browse courses
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {saved.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default SavedCoursesPage;
