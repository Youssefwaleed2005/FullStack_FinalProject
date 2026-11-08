import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Where the signed-in user is remembered between visits
export const TOKEN_KEY = "andalusia.token";
export const USER_KEY = "andalusia.user";

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A 401 on a normal request means the token expired or was tampered with.
// A 401 on login/register is just bad credentials — don't log the user out.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? "";
    const isAuthAttempt =
      url.includes("/auth/login") || url.includes("/auth/register");

    if (error.response?.status === 401 && !isAuthAttempt) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  },
);

// The API always answers a failure with { statusCode, message }
export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (!error.response) return "Cannot reach the server. Is the API running?";
  }
  return fallback;
}

// Per-field messages from a 400 response: { errors: { "email": "…" } } → { email: "…" }
export function getApiFieldErrors(error: unknown): Record<string, string> {
  if (!axios.isAxiosError(error)) return {};
  const errors = (error.response?.data as { errors?: Record<string, unknown> } | undefined)?.errors;
  if (!errors || typeof errors !== "object") return {};
  return Object.fromEntries(
    Object.entries(errors).map(([field, value]) => [
      field.charAt(0).toLowerCase() + field.slice(1),
      Array.isArray(value) ? String(value[0]) : String(value),
    ]),
  );
}

// True when the API answered with the given HTTP status, e.g. 404 or 409
export function hasStatus(error: unknown, status: number): boolean {
  return axios.isAxiosError(error) && error.response?.status === status;
}

export default api;
