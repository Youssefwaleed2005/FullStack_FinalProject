import { useSyncExternalStore } from "react";
import { getCompared, subscribeToCompare } from "@/lib/compare";

export function useCompare() {
  return useSyncExternalStore(subscribeToCompare, getCompared, getCompared);
}
