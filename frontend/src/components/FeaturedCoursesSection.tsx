import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import type { Course } from "../types/Course";

const featuredCourses: Course[] = [
  {
    id: 1,
    title: "React from scratch",
    description: "Build modern web interfaces with React and TypeScript.",
    price: 1200,
    categoryId: 1,
    instructorName: "Aly Zakaria",
    thumbnailUrl: "https://placehold.co/600x400",
  },
  {
    id: 2,
    title: "ASP.NET Core Web API",
    description: "Design and build REST APIs with .NET 8 and EF Core.",
    price: 1500,
    categoryId: 1,
    instructorName: "Aly Zakaria",
    thumbnailUrl: "https://placehold.co/600x400",
  },
  {
    id: 3,
    title: "SQL Server essentials",
    description: "Relational modelling, queries and indexing fundamentals.",
    price: 900,
    categoryId: 2,
    instructorName: "Aly Zakaria",
    thumbnailUrl: "https://placehold.co/600x400",
  },
];

function FeaturedCoursesSection() {
  return (
    <Box sx={{ py: 8, px: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
        Featured courses
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
        }}
      >
        {featuredCourses.map((course) => (
          <Card key={course.id} sx={{ width: 300 }}>
            <CardMedia
              component="img"
              height="160"
              image={course.thumbnailUrl}
              alt={course.title}
            />
            <CardContent>
              <Typography variant="h6">{course.title}</Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 1 }}
              >
                {course.description}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {course.instructorName}
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {course.price} EGP
              </Typography>
              <Button variant="contained" fullWidth>
                View course
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default FeaturedCoursesSection;
