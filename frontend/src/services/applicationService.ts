import api from "./api";
import type {
  Application,
  CreateApplicationRequest,
} from "../types/Application";

// POST /api/applications (Learner only)
export async function createApplication(
  payload: CreateApplicationRequest,
): Promise<Application> {
  const response = await api.post<Application>("/applications", payload);
  return response.data;
}

// GET /api/applications/me
export async function getMyApplications(): Promise<Application[]> {
  const response = await api.get<Application[]>("/applications/me");
  return response.data;
}
