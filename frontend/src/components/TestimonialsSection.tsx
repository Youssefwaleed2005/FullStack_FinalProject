import { Box, Typography, Card, CardContent, Avatar } from "@mui/material";
import type { Testimonial } from "../types/Testimonial";

const testimonials: Testimonial[] = [
  {
    id: 1,
    authorName: "Nour Hassan",
    authorTitle: "Front-end developer",
    content:
      "The full stack track took me from writing my first component to shipping a real project in a few months.",
    photoUrl: "https://placehold.co/80x80",
  },
  {
    id: 2,
    authorName: "Omar Fathy",
    authorTitle: "Data analyst",
    content:
      "Clear explanations and real projects. I was applying what I learned at work the same week.",
    photoUrl: "https://placehold.co/80x80",
  },
  {
    id: 3,
    authorName: "Salma Adel",
    authorTitle: "Software engineering student",
    content:
      "The instructors actually answer questions. That made the difference for me.",
    photoUrl: "https://placehold.co/80x80",
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
                {testimonial.content}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={testimonial.photoUrl}
                  alt={testimonial.authorName}
                />
                <Box>
                  <Typography variant="body2">
                    {testimonial.authorName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {testimonial.authorTitle}
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
