import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import type { CareerPath } from "../types/CareerPath";
import { getCareerPaths } from "../services/CareerPathService";
import CareerPathCard from "../components/CareerPathCard";

function CareerPathsPage() {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCareerPaths()
      .then((data) => setCareerPaths(data))
      .catch(() =>
        setError("Could not load career paths. Please try again later."),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ py: 8, px: 4 }}>
      <Typography variant="h4" sx={{ mb: 1, textAlign: "center" }}>
        Career paths
      </Typography>
      <Typography sx={{ mb: 6, textAlign: "center", color: "text.secondary" }}>
        Choose your goal, and follow a guided journey of programs and courses to
        reach it.
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ maxWidth: 600, mx: "auto" }}>
          {error}
        </Alert>
      )}

      {!loading && !error && careerPaths.length === 0 && (
        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
          No career paths yet.
        </Typography>
      )}

      {!loading && !error && careerPaths.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: "center",
          }}
        >
          {careerPaths.map((careerPath) => (
            <CareerPathCard key={careerPath.id} careerPath={careerPath} />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default CareerPathsPage;
