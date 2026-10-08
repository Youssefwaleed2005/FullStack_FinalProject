import { useEffect, useState } from "react";

type ApiData<T> = {
  data: T | null;
  loading: boolean;
  failed: boolean;
};

// Calls a loader function once and tracks its loading / failed state.
// Define the loader outside the component so it is the same function on every render.
export function useApiData<T>(loader: () => Promise<T>): ApiData<T> {
  const [state, setState] = useState<ApiData<T>>({
    data: null,
    loading: true,
    failed: false,
  });

  useEffect(() => {
    // Ignore the answer if the component was removed before it arrived
    let cancelled = false;

    loader()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, failed: false });
      })
      .catch(() => {
        if (!cancelled) setState({ data: null, loading: false, failed: true });
      });

    return () => {
      cancelled = true;
    };
  }, [loader]);

  return state;
}
