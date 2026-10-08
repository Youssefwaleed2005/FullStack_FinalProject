import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { getCareerPaths } from "../services/CareerPathService";
import type { CareerPath } from "../types/CareerPath";
import { Link } from "react-router-dom";

function CareerPathsSection() {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCareerPaths() {
      try {
        setLoading(true);
        setError("");
        const data = await getCareerPaths();
        setCareerPaths(data);
      } catch {
        setError("Could not load career paths.");
      } finally {
        setLoading(false);
      }
    }

    loadCareerPaths();
  }, []);

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ mb: 1, textAlign: "center" }}>
        Discover your career path
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 4, textAlign: "center", color: "text.secondary" }}
      >
        Follow a guided track instead of picking programs one by one.
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && careerPaths.length === 0 && (
        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
          No career paths yet.
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
        }}
      >
        {careerPaths.map((path) => (
          <Card key={path.id} sx={{ width: { xs: "100%", sm: 300 } }}>
            <CardMedia
              component="img"
              height="160"
              image={
                path.imageUrl ?? "https://placehold.co/600x400?text=Career+Path"
              }
              alt={path.title}
            />
            <CardContent>
              <Typography variant="h6">{path.title}</Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 2 }}
              >
                {path.shortDescription}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {path.programCount} programs
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                to={`/career-paths/${path.id}`}
              >
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
