import { Box, Typography, Card, CardContent } from "@mui/material";
import type { Category } from "../types/Category";

const categories: Category[] = [
  { id: 1, name: "Web Development" },
  { id: 2, name: "Data Science" },
  { id: 3, name: "Business" },
  { id: 4, name: "Design" },
];
function CategoriesSection() {
  return (
    <Box sx={{ py: 8, px: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
        Popular categories
      </Typography>

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
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default CategoriesSection;
