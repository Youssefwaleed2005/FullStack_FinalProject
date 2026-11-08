import api from "./api";
import type {
  Course,
  CourseDetails,
  CourseStatus,
  CourseType,
} from "@/types/Course";
import type { CourseScheduleItem } from "@/types/CourseSchedule";
import type { CourseReviews } from "@/types/Review";
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

export async function getCourseById(id: number): Promise<CourseDetails> {
  const response = await api.get<CourseDetails>(`/courses/${id}`);
  return response.data;
}

export async function getRelatedCourses(
  id: number,
  take = 3,
): Promise<Course[]> {
  const response = await api.get<Course[]>(`/courses/${id}/related`, {
    params: { take },
  });
  return response.data;
}

// Planned sessions shown as the course outline (public)
export async function getCourseSchedule(id: number): Promise<CourseScheduleItem[]> {
  return (await api.get<CourseScheduleItem[]>(`/courses/${id}/schedule`)).data;
}

// Average rating, star breakdown and reviews (public)
export async function getCourseReviews(id: number): Promise<CourseReviews> {
  return (await api.get<CourseReviews>(`/courses/${id}/reviews`)).data;
}

// Admin: deletes the course, or archives it when it has history. Returns true when archived.
export async function deleteCourse(id: number): Promise<boolean> {
  const response = await api.delete<{ archived?: boolean } | "">(`/courses/${id}`);
  return typeof response.data === "object" && response.data?.archived === true;
}

export async function restoreCourse(id: number): Promise<void> {
  await api.put(`/courses/${id}/restore`);
}
