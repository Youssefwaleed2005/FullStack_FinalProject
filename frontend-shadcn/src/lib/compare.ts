import type { Course } from "@/types/Course";

// Courses picked for side-by-side comparison (up to 3), kept in this tab while browsing
export const MAX_COMPARE = 3;
const KEY = "andalusia.compare";
const EVENT = "andalusia:compare";

let cache: Course[] | null = null;

function read(): Course[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(sessionStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed) ? (parsed as Course[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(courses: Course[]) {
  cache = courses;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(courses));
  } catch {
    // storage blocked: still works until the page is reloaded
  }
  window.dispatchEvent(new Event(EVENT));
}

export function getCompared(): Course[] {
  return read();
}

// Returns false when the list is already full
export function toggleCompare(course: Course): boolean {
  const current = read();
  if (current.some((c) => c.id === course.id)) {
    write(current.filter((c) => c.id !== course.id));
    return true;
  }
  if (current.length >= MAX_COMPARE) return false;
  write([...current, course]);
  return true;
}

export function clearCompare() {
  write([]);
}

export function subscribeToCompare(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}
