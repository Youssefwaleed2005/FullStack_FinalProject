import api from "./api";
import type { Partner } from "@/types/Partner";

export async function getPartners(take?: number): Promise<Partner[]> {
  const response = await api.get<Partner[]>("/partners", { params: { take } });
  return response.data;
}
