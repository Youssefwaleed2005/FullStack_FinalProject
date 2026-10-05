import { Card, CardContent, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import type { CareerPath } from "../types/CareerPath";

type CareerPathCardProps = {
  careerPath: CareerPath;
};

function CareerPathCard({ careerPath }: CareerPathCardProps) {
  return (
    <Card sx={{ width: 300, display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6">{careerPath.title}</Typography>
        {careerPath.shortDescription && (
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            {careerPath.shortDescription}
          </Typography>
        )}
        <Typography variant="body2" sx={{ mb: 2, mt: "auto" }}>
          {careerPath.programCount}{" "}
          {careerPath.programCount === 1 ? "program" : "programs"}
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          component={Link}
          to={`/career-paths/${careerPath.id}`}
        >
          View path
        </Button>
      </CardContent>
    </Card>
  );
}

export default CareerPathCard;
