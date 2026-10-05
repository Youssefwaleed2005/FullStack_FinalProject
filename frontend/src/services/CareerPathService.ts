import api from "./api";
import type { CareerPath } from "../types/CareerPath";
import type { CareerPathDetails } from "../types/CareerPathDetails";

export async function getCareerPaths() {
  const response = await api.get<CareerPath[]>("/CareerPaths");
  return response.data;
}
export async function getCareerPathById(
  id: number,
): Promise<CareerPathDetails> {
  const response = await api.get<CareerPathDetails>(`/careerpaths/${id}`);
  return response.data;
}
