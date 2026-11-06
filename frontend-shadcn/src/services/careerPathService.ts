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

// Published career paths with their courses in learning order (recommendedCourses), for the hero roadmap.
// The list endpoint has no courses, so this asks for each path's details; a path whose details fail is skipped.
export async function getCareerPathRoadmaps(
  take = 5,
): Promise<CareerPathDetails[]> {
  const paths = await getCareerPaths({ take });
  const results = await Promise.allSettled(
    paths.map((path) => getCareerPathById(path.id)),
  );
  return results.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : [],
  );
}
