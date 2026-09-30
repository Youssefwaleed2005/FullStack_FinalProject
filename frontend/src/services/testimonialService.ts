import api from "./api";
import type { Testimonial } from "../types/Testimonial";

export async function getTestimonials() {
  const response = await api.get<Testimonial[]>("/Testimonials");
  return response.data;
}
