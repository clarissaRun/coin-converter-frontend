import { createContext, useContext } from "react";
import type { User,LoginCredentials } from "../models/User";

export interface AuthContextType {
  login: (
    credentials: LoginCredentials
  ) => Promise<{ success: boolean; error: string | null }>;
  logout: () => void;
  token: string | null;
  user: User | null;
  error: string | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
