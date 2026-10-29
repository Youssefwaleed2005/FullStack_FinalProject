import api from "./api";
import type { Partner, PartnerAdmin, PartnerRequest } from "@/types/Partner";

export async function getPartners(take?: number): Promise<Partner[]> {
  const response = await api.get<Partner[]>("/partners", { params: { take } });
  return response.data;
}

// All partners, hidden ones included (Admin / ContentManager)
export async function getManagePartners(): Promise<PartnerAdmin[]> {
  return (await api.get<PartnerAdmin[]>("/partners/manage")).data;
}

export async function createPartner(payload: PartnerRequest): Promise<PartnerAdmin> {
  return (await api.post<PartnerAdmin>("/partners", payload)).data;
}

export async function updatePartner(id: number, payload: PartnerRequest): Promise<PartnerAdmin> {
  return (await api.put<PartnerAdmin>(`/partners/${id}`, payload)).data;
}

export async function deletePartner(id: number): Promise<void> {
  await api.delete(`/partners/${id}`);
}
