import api from "./api";
import type { Enrollment } from "@/types/Enrollment";

export async function getMyEnrollments(): Promise<Enrollment[]> {
  const response = await api.get<Enrollment[]>("/enrollments/me");
  return response.data;
}
