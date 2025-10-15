import { useState, useCallback } from "react";
import { api, isAxiosError } from "../lib/api";
import type { User, UserLogin } from "../models/User";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<UserLogin>("/auth/login", {
        email,
        password,
      });
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
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return { user, setUser, token, setToken, error, isLoading, login, logout };
};
