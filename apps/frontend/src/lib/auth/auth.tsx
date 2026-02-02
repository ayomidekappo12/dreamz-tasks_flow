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
  signIn: (email: string, password: string) => User | null;
  signUp: (email: string, password: string) => User;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setLoading(false);
  }, []);

  const signIn = (email: string, password: string) => {
    const user = loginUser(email, password);
    if (user) setUser(user);
    return user;
  };

  const signUp = (email: string, password: string) => {
    const user = signupUser(email, password);
    setUser(user);
    return user;
  };

  const signOut = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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
