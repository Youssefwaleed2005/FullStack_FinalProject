import api from "./api";
import type { Testimonial, TestimonialAdmin, TestimonialRequest } from "@/types/Testimonial";

export async function getTestimonials(take?: number): Promise<Testimonial[]> {
  const response = await api.get<Testimonial[]>("/testimonials", {
    params: { take },
  });
  return response.data;
}

// All testimonials, unpublished ones included (Admin / ContentManager)
export async function getManageTestimonials(): Promise<TestimonialAdmin[]> {
  return (await api.get<TestimonialAdmin[]>("/testimonials/manage")).data;
}

export async function createTestimonial(payload: TestimonialRequest): Promise<TestimonialAdmin> {
  return (await api.post<TestimonialAdmin>("/testimonials", payload)).data;
}

export async function updateTestimonial(id: number, payload: TestimonialRequest): Promise<TestimonialAdmin> {
  return (await api.put<TestimonialAdmin>(`/testimonials/${id}`, payload)).data;
}

export async function deleteTestimonial(id: number): Promise<void> {
  await api.delete(`/testimonials/${id}`);
}
