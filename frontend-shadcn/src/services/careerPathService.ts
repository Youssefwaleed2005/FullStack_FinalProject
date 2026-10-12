import api from "./api";
import type { CareerPath, CareerPathDetails } from "@/types/CareerPath";

export type CareerPathQueryParams = {
  isFeatured?: boolean;
  take?: number;
};

export async function getCareerPaths(
  params?: CareerPathQueryParams,
): Promise<CareerPath[]> {
  const response = await api.get<CareerPath[]>("/careerpaths", { params });
  return response.data;
}

export async function getCareerPathById(
  id: number,
): Promise<CareerPathDetails> {
  const response = await api.get<CareerPathDetails>(`/careerpaths/${id}`);
  return response.data;
}
