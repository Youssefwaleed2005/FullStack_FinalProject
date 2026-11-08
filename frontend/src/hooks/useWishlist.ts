import { useSyncExternalStore } from "react";
import { getSavedCourses, subscribeToWishlist } from "../utils/wishlist";

// The saved courses, kept in sync across components and tabs
export function useWishlist() {
  return useSyncExternalStore(subscribeToWishlist, getSavedCourses, getSavedCourses);
}
