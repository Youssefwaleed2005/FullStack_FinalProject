export type UserSummary = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string | null;
  roles: string[];
};

export type AuthResponse = {
  token: string;
  expiresAt: string;
  user: UserSummary;
};

export type UserProfile = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string | null;
  phoneNumber: string | null;
  country: string | null;
  preferredLanguage: string | null;
  createdAt: string;
  roles: string[];
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  country?: string;
  preferredLanguage?: string;
  acceptedTerms: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type UpdateProfileRequest = {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  country?: string;
  preferredLanguage?: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ResetPasswordRequest = {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
};

export type ForgotPasswordResponse = {
  message: string;
  // Development only: the backend has no email service, so it returns the link for the demo
  devResetLink: string | null;
};
