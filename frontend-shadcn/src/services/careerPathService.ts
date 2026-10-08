import api from "./api";
import type { CareerPath } from "@/types/CareerPath";

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
