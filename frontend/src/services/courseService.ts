import api from "./api";
import type { Course } from "../types/Course";
import type { PagedResponse } from "../types/PagedResponse";
import type { CourseDetails } from "../types/CourseDetails";

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

export async function getCourseById(id: number): Promise<CourseDetails> {
  const response = await api.get<CourseDetails>(`/courses/${id}`);
  return response.data;
}

export async function getRelatedCourses(
  id: number,
  take = 4,
): Promise<Course[]> {
  const response = await api.get<Course[]>(`/courses/${id}/related`, {
    params: { take },
  });
  return response.data;
}
