import { createContext, useState, ReactNode, useCallback } from "react";
import { User, fetchUserProfile } from "@/lib/api";
import { jwtDecode } from "jwt-decode";

export type { User };

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  loginWithToken: (token: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const isAuthenticated = !!token;

  const login = (userData: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const updateUser = useCallback((updatedUserData: Partial<User>) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      const newUser = { ...currentUser, ...updatedUserData };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  const loginWithToken = async (token: string) => {
    try {
      localStorage.setItem("token", token);
      const decoded: { email: string } = jwtDecode(token);
      const userProfile = await fetchUserProfile(decoded.email);
      localStorage.setItem("user", JSON.stringify(userProfile));
      setUser(userProfile);
      setToken(token);
    } catch (error) {
      console.error("Failed to login with token:", error);
      logout(); // Clear any partial login data on failure
    }
  };


  const value = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    updateUser,
    loginWithToken,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};