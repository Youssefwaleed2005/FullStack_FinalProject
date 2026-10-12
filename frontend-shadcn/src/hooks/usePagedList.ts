import { useEffect, useState } from "react";
import axios from "axios";
import type { PagedResponse } from "@/types/PagedResponse";

type Result<T> = {
  requestKey: string;
  data: PagedResponse<T> | null;
  error: string | null;
};

// Loads one page of a list and reloads whenever the params change.
// Define the loader outside the component so it is the same function on every render.
export function usePagedList<T, P>(
  loader: (params: P, signal: AbortSignal) => Promise<PagedResponse<T>>,
  params: P,
  errorMessage: string,
) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result<T> | null>(null);

  // A text key identifies the request, so the effect only reruns when a value really changes
  const query = JSON.stringify(params);
  const requestKey = `${query}#${attempt}`;

  useEffect(() => {
    // Cancels the request if the filters change again before it finishes,
    // so an old slow response can never overwrite a newer one
    const controller = new AbortController();

    loader(JSON.parse(query) as P, controller.signal)
      .then((data) => setResult({ requestKey, data, error: null }))
      .catch((error: unknown) => {
        if (axios.isCancel(error)) return;
        setResult({ requestKey, data: null, error: errorMessage });
      });

    return () => controller.abort();
  }, [loader, query, requestKey, errorMessage]);

  // Still loading until the stored result belongs to the current request
  const loading = result?.requestKey !== requestKey;

  return {
    data: loading ? null : result.data,
    error: loading ? null : result.error,
    loading,
    retry: () => setAttempt((current) => current + 1),
  };
}
