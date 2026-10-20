// The API stores times in UTC but sends them without "Z".
// Add the "Z" so the browser converts them to local time correctly.
export function toDate(value: string): Date {
  const hasZone = /[zZ]|[+-]\d\d:\d\d$/.test(value);
  return new Date(value.includes("T") && !hasZone ? `${value}Z` : value);
}

// "Mon 20 Oct, 16:00"
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "-";
  return toDate(value).toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// "20 Oct 2026"
export function formatDate(value: string | null | undefined): string {
  if (!value) return "-";
  return toDate(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// API date → value for <input type="datetime-local"> (local time, "2026-10-24T16:00")
export function toLocalInputValue(value: string | null | undefined): string {
  if (!value) return "";
  const d = toDate(value);
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

// <input type="datetime-local"> value → UTC ISO string for the API
export function fromLocalInputValue(value: string): string {
  return new Date(value).toISOString();
}
