import api from "./api";
import type { Course, CourseStatus, CourseType } from "@/types/Course";
import type { PagedResponse } from "@/types/PagedResponse";

export type CourseQueryParams = {
  search?: string;
  categoryId?: number;
  status?: CourseStatus;
  type?: CourseType;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "title" | "price" | "newest";
  sortDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
};

// The signal lets the caller cancel a request that is no longer needed
export async function getCourses(
  params?: CourseQueryParams,
  signal?: AbortSignal,
): Promise<PagedResponse<Course>> {
  const response = await api.get<PagedResponse<Course>>("/courses", {
    params,
    signal,
  });
  return response.data;
}
