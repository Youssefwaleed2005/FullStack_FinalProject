import { useCallback, useMemo, useState, type ReactNode } from "react";
import { AuthContext } from "@/lib/authContext";
import { TOKEN_KEY, USER_KEY } from "@/services/api";
import * as authService from "@/services/authService";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserSummary,
} from "@/types/Auth";

function readStoredUser(): UserSummary | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as UserSummary) : null;
  } catch {
    return null;
  }
}

// Keeps track of who is signed in and shares it with the whole app
function AuthProvider({ children }: { children: ReactNode }) {
  // Read straight away, so a refresh on a protected page does not bounce to login
  const [user, setUser] = useState<UserSummary | null>(readStoredUser);

  const applyAuth = useCallback((result: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    setUser(result.user);
    return result.user;
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

  const updateUser = useCallback((changes: Partial<UserSummary>) => {
    setUser((current) => {
      if (!current) return current;
      const next = { ...current, ...changes };
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(next));
      } catch {
        // storage blocked: the change still shows until the page is reloaded
      }
      return next;
    });
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
      updateUser,
      hasRole,
    }),
    [user, login, register, logout, updateUser, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
