import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { LoginFormValues } from '../components/LoginPage';
import * as authApi from '../api/authApi';
import { clearToken, getToken, setToken } from '../api/client';
import type { ApiUser } from '../api/types';
import type { ProfileUpdatePayload, User } from '../types/auth';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (values: LoginFormValues) => Promise<void>;
  register: (values: LoginFormValues) => Promise<void>;
  logout: () => void;
  updateProfile: (payload: ProfileUpdatePayload) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapApiUser(apiUser: ApiUser, rememberMe = false): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    displayName: apiUser.displayName,
    avatar: apiUser.avatar,
    rememberMe,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    authApi
      .getMe()
      .then(({ user: apiUser }) => setUser(mapApiUser(apiUser)))
      .catch(() => {
        clearToken();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (values: LoginFormValues) => {
    const { token, user: apiUser } = await authApi.login(
      values.email.trim(),
      values.password,
    );
    setToken(token);
    setUser(mapApiUser(apiUser, values.rememberMe));
  }, []);

  const register = useCallback(async (values: LoginFormValues) => {
    const { token, user: apiUser } = await authApi.register(
      values.email.trim(),
      values.password,
    );
    setToken(token);
    setUser(mapApiUser(apiUser, values.rememberMe));
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (payload: ProfileUpdatePayload) => {
    const { user: apiUser } = await authApi.updateProfile(payload);
    setUser((prev) => {
      if (!prev) {
        return mapApiUser(apiUser);
      }
      return {
        ...mapApiUser(apiUser, prev.rememberMe),
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, isLoading, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
