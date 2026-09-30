import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import type { Testimonial } from "../types/Testimonial";
import { getTestimonials } from "../services/testimonialService";

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTestimonials(3)
      .then((data) => setTestimonials(data))
      .catch(() =>
        setError("Could not load testimonials. Please try again later."),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ py: 8, px: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
        What our students say
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

      {!loading && !error && testimonials.length === 0 && (
        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
          No testimonials yet.
        </Typography>
      )}

      {!loading && !error && testimonials.length > 0 && (
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
                    src={testimonial.photoUrl ?? undefined}
                    alt={testimonial.authorName}
                  >
                    {testimonial.authorName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2">
                      {testimonial.authorName}
                    </Typography>
                    {testimonial.authorTitle && (
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {testimonial.authorTitle}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default TestimonialsSection;
