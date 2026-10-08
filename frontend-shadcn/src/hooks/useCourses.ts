import { useEffect, useState } from "react";
import axios from "axios";
import { getCourses, type CourseQueryParams } from "@/services/courseService";
import type { Course } from "@/types/Course";
import type { PagedResponse } from "@/types/PagedResponse";

type Result = {
  requestKey: string;
  data: PagedResponse<Course> | null;
  error: string | null;
};

// Loads a page of courses and reloads whenever the params change.
export function useCourses(params: CourseQueryParams) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  // A text key identifies the request, so the effect only reruns when a value really changes
  const query = JSON.stringify(params);
  const requestKey = `${query}#${attempt}`;

  useEffect(() => {
    // Cancels the request if the filters change again before it finishes,
    // so an old slow response can never overwrite a newer one
    const controller = new AbortController();

    getCourses(JSON.parse(query) as CourseQueryParams, controller.signal)
      .then((data) => setResult({ requestKey, data, error: null }))
      .catch((error: unknown) => {
        if (axios.isCancel(error)) return;
        setResult({
          requestKey,
          data: null,
          error: "We couldn't load the courses. Please try again.",
        });
      });

    return () => controller.abort();
  }, [query, requestKey]);

  // Still loading until the stored result belongs to the current request
  const loading = result?.requestKey !== requestKey;

  return {
    data: loading ? null : result.data,
    error: loading ? null : result.error,
    loading,
    retry: () => setAttempt((current) => current + 1),
  };
}
