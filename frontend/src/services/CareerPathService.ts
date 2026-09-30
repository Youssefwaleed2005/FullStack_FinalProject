import api from "./api";
import type { CareerPath } from "../types/CareerPath";

export async function getCareerPaths() {
  const response = await api.get<CareerPath[]>("/CareerPaths");
  return response.data;
}
