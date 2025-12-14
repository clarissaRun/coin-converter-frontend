import React, { useEffect, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../hooks/useAuth";
import type { User, UserRole } from "../models/User"; 
import { AuthContext } from "./Auth.context";

interface JwtPayload {
  sub: string;
  role: UserRole; 
  email: string;
  firstName: string;
  lastName: string;
  exp: number;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { 
    user, 
    setUser, 
    token, 
    login, 
    logout, 
    register, 
    error, 
    isLoading 
  } = useAuth();

  useEffect(() => {
    if (token) {
      try {
        const decodedPayload = jwtDecode<JwtPayload>(token);
        
        const userFromToken: User = {
          id: decodedPayload.sub,
          email: decodedPayload.email,
          firstName: decodedPayload.firstName,
          lastName: decodedPayload.lastName,
          role: decodedPayload.role as UserRole,
        };
        
        if (!user || user.id !== userFromToken.id) {
            setUser(userFromToken);
        }

      } catch (e) {
        console.error("Token inválido", e);
        logout();
      }
    } else {
      if (user) setUser(null);
    }
  }, [token, setUser, logout, user]);

  const value = {
    login,
    logout,
    register,
    token,
    user,
    error,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};