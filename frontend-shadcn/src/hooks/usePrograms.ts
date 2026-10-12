import { usePagedList } from "@/hooks/usePagedList";
import {
  getPrograms,
  type ProgramQueryParams,
} from "@/services/programService";

// Loads a page of programs and reloads whenever the params change.
export function usePrograms(params: ProgramQueryParams) {
  return usePagedList(
    getPrograms,
    params,
    "We couldn't load the programs. Please try again.",
  );
}
