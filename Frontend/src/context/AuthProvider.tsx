import { type ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { getMe, logout as logoutRequest } from "../features/auth/authApi";
import type { User } from "../types/types";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);
  const navigate = useNavigate();


 useEffect(() => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  const loadUserData = async () => {
    try {
      const userData = await getMe();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  loadUserData();
}, []);

  const login = (userData: User) => {
    setUser(userData);
    setLogoutMessage(null);
  };

  const clearAuthState = (message?: string) => {
    setUser(null);
    setLogoutMessage(message ?? null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login", {
      replace: true,
      state: message ? { message } : null
    });
  };

  const logout = async (message?: string) => {
    await logoutRequest();
    clearAuthState(message)
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
        logoutMessage,
        clearAuthState,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
