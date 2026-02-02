"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { User } from "./mock-auth";
import {
  login as loginUser,
  signup as signupUser,
  logout as logoutUser,
  getCurrentUser,
} from "./mock-auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  // FIXED: Match mock-auth signatures (email + password)
  login: (email: string, password: string) => User | null;
  signup: (email: string, password: string) => User;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setLoading(false);
  }, []);

  // FIXED: Accept email/password and pass both to loginUser
  const login = (email: string, password: string) => {
    const user = loginUser(email, password);
    if (user) setUser(user);
    return user; // Return result for caller handling
  };

  // FIXED: Accept email/password (not name/email)
  const signup = (email: string, password: string) => {
    const user = signupUser(email, password);
    setUser(user);
    return user;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
