import api from "./api";
import type { Partner } from "../types/Partner";

export async function getPartners() {
  const response = await api.get<Partner[]>("/partners");
  return response.data;
}
