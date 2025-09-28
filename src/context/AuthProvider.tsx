import React, { useEffect, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useStorageState } from '../hooks/useStorageState';
import { api } from '../lib/api';
import type { User } from '../models/User';
import { AuthContext } from './Auth.context';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, setUser, token, setToken, login, logout, error, isLoading } = useAuth();
  const [session, setSession] = useStorageState<string | null>('token', null);

  useEffect(() => {
    if (session && !token) {
      setToken(session);
    }
  }, [session, token, setToken]);

  useEffect(() => {
    setSession(token);
    if (token) {
      api.get<User>('/auth/profile')
        .then(response => setUser(response.data))
        .catch(() => {
          logout();
        });
    } else {
      setUser(null);
    }
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