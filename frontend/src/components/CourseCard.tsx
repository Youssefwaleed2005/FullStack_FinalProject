import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import type { Course } from "../types/Course";

const PLACEHOLDER_IMAGE = "https://placehold.co/600x400?text=Course";

type CourseCardProps = {
  course: Course;
};

function CourseCard({ course }: CourseCardProps) {
  return (
    <Card sx={{ width: 300 }}>
      <CardMedia
        component="img"
        height="160"
        image={course.imageUrl ?? PLACEHOLDER_IMAGE}
        alt={course.title}
      />
      <CardContent>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {course.categoryName}
        </Typography>
        <Typography variant="h6">{course.title}</Typography>
        {course.shortDescription && (
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
            {course.shortDescription}
          </Typography>
        )}
        {course.instructorName && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            {course.instructorName}
          </Typography>
        )}
        <Typography variant="body2" sx={{ mb: 1 }}>
          {course.durationHours} hours
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {course.price} EGP
        </Typography>
        <Button variant="contained" fullWidth>
          View course
        </Button>
      </CardContent>
    </Card>
  );
}

export default CourseCard;
