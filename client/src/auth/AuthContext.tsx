import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { api, accessTokenKey } from "../api/client";
import type { AuthUser, CurrentUserResponse, LoginResponse } from "../types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<AuthUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem(accessTokenKey));
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(accessTokenKey);
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<{ success: true; data: CurrentUserResponse }>("/auth/me");
        setUser(response.data.data.user);
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, [accessToken, logout]);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    const response = await api.post<{ success: true; data: LoginResponse }>("/auth/login", credentials);
    const { accessToken: nextAccessToken, user: nextUser } = response.data.data;

    localStorage.setItem(accessTokenKey, nextAccessToken);
    setAccessToken(nextAccessToken);
    setUser(nextUser);
    return nextUser;
  }, []);

  const value = useMemo(
    () => ({ user, accessToken, isLoading, login, logout }),
    [accessToken, isLoading, login, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
