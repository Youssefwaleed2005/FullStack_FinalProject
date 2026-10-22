// Helpers for <input type="datetime-local"> on the instructor pages.
// The API stores UTC times and sends them without a "Z".

function toDate(value: string): Date {
  const hasZone = /[zZ]|[+-]\d\d:\d\d$/.test(value);
  return new Date(value.includes("T") && !hasZone ? `${value}Z` : value);
}

// API date → input value in local time, e.g. "2026-10-24T16:00"
export function toLocalInputValue(value: string | null | undefined): string {
  if (!value) return "";
  const date = toDate(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

// Input value (local time) → UTC ISO string for the API
export function fromLocalInputValue(value: string): string {
  return new Date(value).toISOString();
}

// "2026-11-01T00:00:00" → "2026-11-01" for <input type="date">
export function toDateInputValue(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "";
}
