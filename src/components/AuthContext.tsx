"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Types
type User = { name: string; email: string } | null;
type AuthContextValue = {
  user: User;
  isGuest: boolean;
  signIn: (email: string, password: string) => void;
  signUp: (name: string, email: string, password: string) => void;
  signOut: () => void;
  continueAsGuest: () => void;
};
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isGuest, setIsGuest] = useState(false);
  const router = useRouter();

  // Check for auth status in localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("ncert-user");
    const guest = localStorage.getItem("ncert-guest");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsGuest(false);
    } else if (guest) {
      setUser(null);
      setIsGuest(true);
    }
  }, []);

  // API: sign in, sign up, guest, sign out
  const signIn = (email: string, password: string) => {
    // No real check, accept any input for demo purposes
    const fakeName = email.split("@")[0];
    const newUser = { name: fakeName, email };
    localStorage.setItem("ncert-user", JSON.stringify(newUser));
    localStorage.removeItem("ncert-guest");
    setUser(newUser);
    setIsGuest(false);
    router.push("/inspired");
  };
  const signUp = (name: string, email: string, password: string) => {
    const newUser = { name, email };
    localStorage.setItem("ncert-user", JSON.stringify(newUser));
    localStorage.removeItem("ncert-guest");
    setUser(newUser);
    setIsGuest(false);
    router.push("/inspired");
  };
  const signOut = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem("ncert-user");
    localStorage.removeItem("ncert-guest");
    router.push("/");
  };
  const continueAsGuest = () => {
    localStorage.removeItem("ncert-user");
    localStorage.setItem("ncert-guest", "1");
    setUser(null);
    setIsGuest(true);
    router.push("/inspired");
  };
  
  return (
    <AuthContext.Provider value={{ user, isGuest, signIn, signUp, signOut, continueAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
