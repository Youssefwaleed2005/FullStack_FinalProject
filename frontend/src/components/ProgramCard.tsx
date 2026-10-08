import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import type { Program } from "../types/Program";

const PLACEHOLDER_IMAGE = "https://placehold.co/600x400?text=Program";

type ProgramCardProps = {
  program: Program;
};

function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Card sx={{ width: { xs: "100%", sm: 300 } }}>
      <CardMedia
        component="img"
        height="160"
        image={program.imageUrl ?? PLACEHOLDER_IMAGE}
        alt={program.title}
      />
      <CardContent>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {program.categoryName}
        </Typography>
        <Typography variant="h6">{program.title}</Typography>
        {program.shortDescription && (
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
            {program.shortDescription}
          </Typography>
        )}
        <Typography variant="body2" sx={{ mb: 1 }}>
          {program.durationWeeks} weeks · {program.courseCount}{" "}
          {program.courseCount === 1 ? "course" : "courses"}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {program.price} EGP
        </Typography>
        <Button
          variant="contained"
          fullWidth
          component={Link}
          to={`/programs/${program.id}`}
        >
          View program
        </Button>
      </CardContent>
    </Card>
  );
}

export default ProgramCard;
