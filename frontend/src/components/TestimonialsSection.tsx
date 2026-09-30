import { Box, Typography, Card, CardContent, Avatar } from "@mui/material";
import type { Testimonial } from "../types/Testimonial";

const testimonials: Testimonial[] = [
  {
    id: 1,
    studentName: "Nour Hassan",
    studentTitle: "Front-end developer",
    message:
      "The full stack track took me from writing my first component to shipping a real project in a few months.",
    avatarUrl: "https://placehold.co/80x80",
  },
  {
    id: 2,
    studentName: "Omar Fathy",
    studentTitle: "Data analyst",
    message:
      "Clear explanations and real projects. I was applying what I learned at work the same week.",
    avatarUrl: "https://placehold.co/80x80",
  },
  {
    id: 3,
    studentName: "Salma Adel",
    studentTitle: "Software engineering student",
    message:
      "The instructors actually answer questions. That made the difference for me.",
    avatarUrl: "https://placehold.co/80x80",
  },
];

function TestimonialsSection() {
  return (
    <Box sx={{ py: 8, px: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
        What our students say
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
        }}
      >
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} sx={{ width: 300 }}>
            <CardContent>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {testimonial.message}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={testimonial.avatarUrl}
                  alt={testimonial.studentName}
                />
                <Box>
                  <Typography variant="body2">
                    {testimonial.studentName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {testimonial.studentTitle}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default TestimonialsSection;
