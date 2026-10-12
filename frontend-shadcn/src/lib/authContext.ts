import { createContext } from "react";
import type { LoginRequest, RegisterRequest, UserSummary } from "@/types/Auth";

export type AuthContextValue = {
  user: UserSummary | null;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: string[]) => boolean;
};

// Filled in by AuthProvider, read with the useAuth hook
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
