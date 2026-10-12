import { usePagedList } from "@/hooks/usePagedList";
import { getCourses, type CourseQueryParams } from "@/services/courseService";

// Loads a page of courses and reloads whenever the params change.
export function useCourses(params: CourseQueryParams) {
  return usePagedList(
    getCourses,
    params,
    "We couldn't load the courses. Please try again.",
  );
}
