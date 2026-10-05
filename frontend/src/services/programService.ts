import api from "./api";
import type { Program } from "../types/Program";
import type { ProgramDetails } from "../types/ProgramDetails";
import type { PagedResponse } from "../types/PagedResponse";

export type ProgramQueryParams = {
  search?: string;
  categoryId?: number;
  isFeatured?: boolean;
  sortBy?: "title" | "price" | "startDate" | "newest";
  sortDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
};

export async function getPrograms(
  params?: ProgramQueryParams,
): Promise<PagedResponse<Program>> {
  const response = await api.get<PagedResponse<Program>>("/programs", {
    params,
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
