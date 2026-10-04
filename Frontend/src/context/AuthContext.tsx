import { createContext, useContext } from "react";

import type { User } from "../types/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: (message?: string) => Promise<void>;
  logoutMessage: string | null;
  clearAuthState: (message?: string) => void;
  updateUser: (userData: User) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
};
