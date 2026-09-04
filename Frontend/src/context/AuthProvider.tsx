import { type ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { getMe } from "../features/auth/authApi";
import type { User } from "../types/types";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Token validation helper
  const isTokenValid = (token: string | null): boolean => {
    if (!token || token === "null") return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem("token");
      if (!isTokenValid(token)) {
        console.warn("🚨 Invalid or expired token found, clearing...");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
        setIsLoading(false);
        return;
      }

      try {
        const userData = await getMe();
        if (userData) {
          setUser(userData);
          setToken(token);
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isLoading,
        login,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
