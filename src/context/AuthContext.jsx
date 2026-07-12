import { createContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';
import { tokenStore } from '../api/axiosInstance';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ip_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate current user from token on first load (validates token is still good)
  useEffect(() => {
    const bootstrap = async () => {
      const token = tokenStore.getAccess();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await authApi.me();
        setUser(data);
        localStorage.setItem('ip_user', JSON.stringify(data));
      } catch {
        tokenStore.clear();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authApi.login(credentials);
    tokenStore.set(data.accessToken, data.refreshToken);
    setUser(data.user);
    localStorage.setItem('ip_user', JSON.stringify(data.user));
    toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload);
    toast.success('Account created. Please sign in.');
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // best-effort; clear local state regardless
    }
    tokenStore.clear();
    setUser(null);
  }, []);

  const updateUserInContext = useCallback((partial) => {
    setUser((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem('ip_user', JSON.stringify(next));
      return next;
    });
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    role: user?.role,
    login,
    register,
    logout,
    updateUserInContext,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
