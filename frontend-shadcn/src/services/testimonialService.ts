import api from "./api";
import type { Testimonial } from "@/types/Testimonial";

export async function getTestimonials(take?: number): Promise<Testimonial[]> {
  const response = await api.get<Testimonial[]>("/testimonials", {
    params: { take },
  });
  return response.data;
}
