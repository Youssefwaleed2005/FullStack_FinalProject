import api from "./api";
import type {
  Application,
  CreateApplicationRequest,
} from "../types/Application";

export async function createApplication(
  payload: CreateApplicationRequest,
): Promise<Application> {
  const response = await api.post<Application>("/applications", payload);
  return response.data;
}

export async function getMyApplications(): Promise<Application[]> {
  const response = await api.get<Application[]>("/applications/me");
  return response.data;
}
