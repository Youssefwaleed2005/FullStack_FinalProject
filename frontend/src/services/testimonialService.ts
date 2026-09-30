import api from "./api";
import type { Testimonial } from "../types/Testimonial";

<<<<<<< HEAD
export async function getTestimonials(take?: number): Promise<Testimonial[]> {
  const response = await api.get<Testimonial[]>("/testimonials", {
    params: { take },
  });
=======
export async function getTestimonials() {
  const response = await api.get<Testimonial[]>("/Testimonials");
>>>>>>> origin/dev/calling-endpoints
  return response.data;
}
