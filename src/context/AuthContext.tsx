import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import type { ReactElement, PropsWithChildren } from "react";
import { jwtDecode } from "jwt-decode";

/**
 * Types you can extend with any custom claims your API adds to the JWT.
 */
export interface JwtPayload {
  sub: string;
  email?: string;
  name?: string;
  role?: string;
  exp?: number;
}

export type LoginOpts = { remember?: boolean };

interface AuthContextValue {
  token: string | null;
  user: JwtPayload | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, opts?: LoginOpts) => void;
  logout: () => void;
  getAuthHeader: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEFAULT_STORAGE_KEY = "access_token";

// ---- helpers --------------------------------------------------------------
function safeDecode(rawToken: string): JwtPayload | null {
  try {
    const decoded = jwtDecode<JwtPayload>(rawToken);
    if (decoded?.exp && decoded.exp * 1000 <= Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

function getStoredToken(storageKey: string): string | null {
  return localStorage.getItem(storageKey) ?? sessionStorage.getItem(storageKey);
}

// ---- provider -------------------------------------------------------------
export function AuthProvider({
  children,
  storageKey = DEFAULT_STORAGE_KEY,
}: PropsWithChildren<{ storageKey?: string }>) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const expiryTimeout = useRef<number | null>(null);

  const clearToken = () => {
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageKey);
    setToken(null);
    setUser(null);
    if (expiryTimeout.current) {
      window.clearTimeout(expiryTimeout.current);
      expiryTimeout.current = null;
    }
  };

  const scheduleExpiry = (payload: JwtPayload | null) => {
    if (expiryTimeout.current) {
      window.clearTimeout(expiryTimeout.current);
      expiryTimeout.current = null;
    }
    if (!payload?.exp) return;
    const ms = payload.exp * 1000 - Date.now();
    if (ms <= 0) {
      clearToken();
      return;
    }
    expiryTimeout.current = window.setTimeout(() => clearToken(), ms);
  };

  // Initial load from storage
  useEffect(() => {
    const existing = getStoredToken(storageKey);
    if (existing) {
      const decoded = safeDecode(existing);
      if (decoded) {
        setToken(existing);
        setUser(decoded);
        scheduleExpiry(decoded);
      } else {
        clearToken();
      }
    }
    setIsLoading(false);
    return () => {
      if (expiryTimeout.current) window.clearTimeout(expiryTimeout.current);
    };
  }, [storageKey]);

  // Cross-tab/session sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return;
      const value = getStoredToken(storageKey);
      if (!value) {
        clearToken();
        return;
      }
      const decoded = safeDecode(value);
      setToken(decoded ? value : null);
      setUser(decoded);
      scheduleExpiry(decoded);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  const login: AuthContextValue["login"] = (newToken, opts) => {
    const remember = !!opts?.remember;
    sessionStorage.setItem(storageKey, newToken);
    if (remember) localStorage.setItem(storageKey, newToken);
    else localStorage.removeItem(storageKey);

    const decoded = safeDecode(newToken);
    setToken(decoded ? newToken : null);
    setUser(decoded);
    scheduleExpiry(decoded);
  };

  const logout = () => clearToken();

  const getAuthHeader = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isLoading,
      isAuthenticated: !!token && !!user,
      login,
      logout,
      getAuthHeader,
    }),
    [token, user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---- hooks ----------------------------------------------------------------
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

/**
 * Simple auth gate. Use like:
 * <RequireAuth fallback={<LoginPage/>}><Dashboard/></RequireAuth>
 */
export function RequireAuth({
  children,
  fallback = null,
}: {
  children: ReactElement;
  fallback?: ReactElement | null;
}) {
  const { isLoading, isAuthenticated } = useAuth();
  if (isLoading) return fallback;
  return isAuthenticated ? children : fallback;
}
