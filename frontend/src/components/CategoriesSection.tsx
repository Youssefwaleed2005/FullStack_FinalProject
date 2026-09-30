import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import type { Category } from "../types/Category";
import { getCategories } from "../services/categoryService";

function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories()
      .then((data) =>
        setCategories(data.filter((category) => category.isFeatured)),
      )
      .catch(() =>
        setError("Could not load categories. Please try again later."),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ py: 8, px: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
        Popular categories
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

      {!loading && !error && categories.length === 0 && (
        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
          No categories yet.
        </Typography>
      )}

      {!loading && !error && categories.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: "center",
          }}
        >
          {categories.map((category) => (
            <Card key={category.id} sx={{ width: 240 }}>
              <CardContent>
                <Typography variant="h6">{category.name}</Typography>
                {category.description && (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {category.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default CategoriesSection;
