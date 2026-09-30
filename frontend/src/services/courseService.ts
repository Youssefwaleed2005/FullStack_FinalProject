import api from "./api";
import type { Course } from "../types/Course";
import type { PagedResponse } from "../types/PagedResponse";

export type CourseQueryParams = {
  search?: string;
  categoryId?: number;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "title" | "price" | "startDate" | "newest";
  sortDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
};

export async function getCourses(
  params?: CourseQueryParams,
): Promise<PagedResponse<Course>> {
  const response = await api.get<PagedResponse<Course>>("/courses", { params });
  return response.data;
}
