import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { User } from "../types/types";
import { fetchUserData } from "../utils/auth";

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Token validation helper
  const isTokenValid = (token: string | null): boolean => {
    if (!token || token === "null") return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
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
        return;
      }

      try {
        const userData = await fetchUserData();
        if (userData) {
          setUser(userData);
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
      }
    };
    loadUserData();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
};
