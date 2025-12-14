import { useState, useCallback } from "react";
import { api, isAxiosError } from "../lib/api";
import type { User, LoginCredentials,LoginResponse } from "../models/User";
import type { RegisterValues } from "../schemas/userSchema";
import { useStorageState } from "./useStorageState";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useStorageState<string | null>("token", null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<LoginResponse>("/auth/login", credentials);
      setToken(response.data.access_token);
      return { success: true, error: null };
    } catch (err) {
      let errorMessage = "Ocurrió un error inesperado";
      if (isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setUser(null);
      setToken(null);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [setToken]);

  const register = useCallback(async (data: RegisterValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post<User>("/auth/register", data);

      return { success: true, error: null };
    } catch (err) {
      let errorMessage = "Error al registrar el usuario";
      if (isAxiosError(err)) {
        if (Array.isArray(err.response?.data?.message)) {
          errorMessage = err.response.data.message.join(", ");
        } else {
          errorMessage = err.response?.data?.message || err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setUser(null);
      setToken(null);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return {
    user,
    setUser,
    token,
    setToken,
    error,
    isLoading,
    login,
    register,
    logout,
  };
};
