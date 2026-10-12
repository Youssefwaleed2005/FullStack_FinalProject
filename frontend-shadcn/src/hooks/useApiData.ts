import { useEffect, useState } from "react";

type ApiData<T> = {
  data: T | null;
  loading: boolean;
  failed: boolean;
  // The thrown error when failed, e.g. to tell a 404 from a network problem
  error: unknown;
};

// Calls a loader function once and tracks its loading / failed state.
// Define the loader outside the component (or wrap it in useCallback) so it is the same function on every render.
export function useApiData<T>(loader: () => Promise<T>): ApiData<T> {
  const [state, setState] = useState<ApiData<T>>({
    data: null,
    loading: true,
    failed: false,
    error: null,
  });

  useEffect(() => {
    // Ignore the answer if the component was removed before it arrived
    let cancelled = false;

    loader()
      .then((data) => {
        if (!cancelled)
          setState({ data, loading: false, failed: false, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setState({ data: null, loading: false, failed: true, error });
      });

    return () => {
      cancelled = true;
    };
  }, [loader]);

  return state;
}
