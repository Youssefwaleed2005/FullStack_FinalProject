import { createContext, useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { TOKEN_KEY, USER_KEY } from "../services/api";
import * as authService from "../services/authService";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserSummary,
} from "../types/Auth";

export type AuthContextValue = {
  user: UserSummary | null;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: string[]) => boolean;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

function readStoredUser(): UserSummary | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as UserSummary) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Read synchronously so a refresh on a protected route doesn't bounce to login.
  const [user, setUser] = useState<UserSummary | null>(readStoredUser);

  const applyAuth = useCallback((result: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    setUser(result.user);
  }, []);

  const login = useCallback(
    async (payload: LoginRequest) =>
      applyAuth(await authService.login(payload)),
    [applyAuth],
  );

  const register = useCallback(
    async (payload: RegisterRequest) =>
      applyAuth(await authService.register(payload)),
    [applyAuth],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (...roles: string[]) =>
      user !== null && roles.some((role) => user.roles.includes(role)),
    [user],
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
      hasRole,
    }),
    [user, login, register, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
