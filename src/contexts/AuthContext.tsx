"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  employeeCode: string;
  officialEmail: string;
  employeeName: string;
  role: "employee" | "manager" | "admin";
}

interface AuthState {
  user: User | null;
  access_token: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (response: { access_token: string; user: User }) => void;
  logout: () => void;
  switchView: (role: "employee" | "manager" | "admin") => void;
  isAuthenticated: boolean;
  activeDashboard: "employee" | "manager" | "admin";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
      const userData = localStorage.getItem("userdata");
      return {
        user: userData ? JSON.parse(userData) : null,
        access_token: null,
      };
  });
  const [activeDashboard, setActiveDashboard] =
    useState<AuthContextType["activeDashboard"]>("employee");

  useEffect(() => {
    const userData = localStorage.getItem("userdata");
    if (userData) {
      setAuthState((prev) => ({
        ...prev,
        user: JSON.parse(userData),
      }));
    }
  }, []);


  useEffect(() => {
    if (authState.user) {
      if (authState.user.role === "admin" || authState.user.role === "manager") {
        setActiveDashboard(authState.user.role);
      } else {
        setActiveDashboard("employee");
      }
    }
  }, [authState]);


  const login = (response: { access_token: string; user: User }) => {
    setAuthState({
      user: response.user,
      access_token: response.access_token,
    });
    localStorage.setItem(
      "auth",
      JSON.stringify({
        user: response.user,
        access_token: response.access_token,
      })
    );
    localStorage.setItem("userdata", JSON.stringify(response.user));
  };

  const logout = () => {
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
    localStorage.removeItem("userdata");
    setAuthState({ user: null, access_token: null });
  };

  const switchView = (tab: "employee" | "manager" | "admin") => {
    setActiveDashboard(tab);
  };

  const value: AuthContextType = {
    user: authState.user,
    token: authState.access_token,
    login,
    logout,
    switchView,
    activeDashboard,
    isAuthenticated: !!authState.access_token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
