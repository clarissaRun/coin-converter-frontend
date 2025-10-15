import React, { useEffect, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../hooks/useAuth";
import { useStorageState } from "../hooks/useStorageState";
import type { User } from "../models/User";
import { AuthContext } from "./Auth.context";

interface JwtPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  exp: number;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, setUser, token, setToken, login, logout, error, isLoading } =
    useAuth();

  const [session, setSession] = useStorageState<string | null>("token", null);

  useEffect(() => {
    if (session) {
      setToken(session);
    }
  }, []);

  useEffect(() => {
    setSession(token);

    if (token) {
      try {
        const decodedPayload = jwtDecode<JwtPayload>(token);
        const userFromToken: User = {
          id: decodedPayload.sub,
          email: decodedPayload.email,
          firstName: decodedPayload.firstName,
          lastName: decodedPayload.lastName,
        };
        setUser(userFromToken);
      } catch (e) {
        console.error("Token inválido, cerrando sesión:", e);
        logout();
      }
    } else {
      // Si no hay token, nos aseguramos de que no haya usuario.
      setUser(null);
    }
    // Esta es la única dependencia que necesitamos. Las funciones logout y setUser son estables.
  }, [token, setSession, setUser, logout]);

  const value = {
    login,
    logout,
    session: token,
    user,
    error,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
