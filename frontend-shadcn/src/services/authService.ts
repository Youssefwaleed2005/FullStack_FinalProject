import api from "./api";
import type {
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  UserProfile,
} from "@/types/Auth";

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

export async function changePassword(payload: ChangePasswordRequest): Promise<void> {
  await api.put("/auth/change-password", payload);
}

// resetUrl = this site's reset page, so the emailed (or logged) link opens here
export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  const resetUrl = `${window.location.origin}/reset-password`;
  const response = await api.post<ForgotPasswordResponse>("/auth/forgot-password", { email }, { params: { resetUrl } });
  return response.data;
}

export async function resetPassword(payload: ResetPasswordRequest): Promise<void> {
  await api.post("/auth/reset-password", payload);
}

export async function uploadProfilePhoto(file: File): Promise<UserProfile> {
  const form = new FormData();
  form.append("file", file);
  return (await api.post<UserProfile>("/auth/me/photo", form)).data;
}
