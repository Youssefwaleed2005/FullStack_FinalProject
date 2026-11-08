import type { Course } from "../types/Course";

// Saved courses live in this browser (localStorage), so visitors can save without an account.
const KEY = "andalusia.wishlist";
const EVENT = "andalusia:wishlist";

let cache: Course[] | null = null;

function read(): Course[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed) ? (parsed as Course[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(courses: Course[]) {
  cache = courses;
  try {
    localStorage.setItem(KEY, JSON.stringify(courses));
  } catch {
    // storage blocked (private mode): the list still works until the page is closed
  }
  window.dispatchEvent(new Event(EVENT));
}

export function getSavedCourses(): Course[] {
  return read();
}

export function isSaved(courseId: number): boolean {
  return read().some((c) => c.id === courseId);
}

// Adds the course, or removes it if it is already saved. Returns true when it is now saved.
export function toggleSaved(course: Course): boolean {
  const current = read();
  if (current.some((c) => c.id === course.id)) {
    write(current.filter((c) => c.id !== course.id));
    return false;
  }
  write([course, ...current]);
  return true;
}

export function removeSaved(courseId: number) {
  write(read().filter((c) => c.id !== courseId));
}

// For useSyncExternalStore: other tabs (storage event) and this tab (custom event)
export function subscribeToWishlist(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) {
      cache = null;
      onChange();
    }
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}
