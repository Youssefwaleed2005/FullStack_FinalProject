import api from "./api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  UserProfile,
} from "../types/Auth";

export async function register(
  payload: RegisterRequest,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/register", payload);
  return response.data;
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data;
}

export async function getProfile(): Promise<UserProfile> {
  const response = await api.get<UserProfile>("/auth/me");
  return response.data;
}

export async function updateProfile(
  payload: UpdateProfileRequest,
): Promise<UserProfile> {
  const response = await api.put<UserProfile>("/auth/me", payload);
  return response.data;
}
