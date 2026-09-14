"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getMe,
  getToken,
  loginUser,
  logout as apiLogout,
  registerUser,
  type LoginPayload,
  type RegisterPayload,
  type User,
} from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  const loadUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const me = await getMe();
      setUser(me);
    } catch (err: unknown) {
      // 401 = token expired/invalid → just logout silently
      // any other error → logout too, but don't crash
      const anyErr = err as { response?: { status?: number } };
      if (anyErr?.response?.status !== 401) {
        console.warn("Auth check failed:", anyErr?.response?.status);
      }
      apiLogout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await loginUser(payload);
    setUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await registerUser(payload);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}