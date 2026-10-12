import api from "./api";
import type { PagedResponse } from "@/types/PagedResponse";
import type { Program, ProgramDetails } from "@/types/Program";

export type ProgramQueryParams = {
  search?: string;
  categoryId?: number;
  isFeatured?: boolean;
  sortBy?: "title" | "price" | "startDate" | "newest";
  sortDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
};

// The signal lets the caller cancel a request that is no longer needed
export async function getPrograms(
  params?: ProgramQueryParams,
  signal?: AbortSignal,
): Promise<PagedResponse<Program>> {
  const response = await api.get<PagedResponse<Program>>("/programs", {
    params,
    signal,
  });
  return response.data;
}

export async function getProgramById(id: number): Promise<ProgramDetails> {
  const response = await api.get<ProgramDetails>(`/programs/${id}`);
  return response.data;
}

export async function getRelatedPrograms(
  id: number,
  take = 3,
): Promise<Program[]> {
  const response = await api.get<Program[]>(`/programs/${id}/related`, {
    params: { take },
  });
  return response.data;
}
