import { createContext, useContext } from 'react';
import type { User } from '../models/User';

export interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  session: string | null;
  user: User | null;
  error: string | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};