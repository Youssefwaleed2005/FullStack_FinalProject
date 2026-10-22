import { createContext } from "react";
import type { LoginRequest, RegisterRequest, UserSummary } from "@/types/Auth";

export type AuthContextValue = {
  user: UserSummary | null;
  isAuthenticated: boolean;
  // Resolves with the signed-in user, e.g. to send them to their dashboard
  login: (payload: LoginRequest) => Promise<UserSummary>;
  register: (payload: RegisterRequest) => Promise<UserSummary>;
  logout: () => void;
  hasRole: (...roles: string[]) => boolean;
};

// Filled in by AuthProvider, read with the useAuth hook
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
