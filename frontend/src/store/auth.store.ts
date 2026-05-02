import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  accountType: string;
  emailVerified: boolean;
  plan: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; accountType?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  clearAuth: () => void;
}

// Helper: set a cookie so the proxy middleware can read it
function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Strict`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.auth.login({ email, password });
          const { user, accessToken, refreshToken } = res.data.data;

          // Save to localStorage for API client
          localStorage.setItem('accessToken', accessToken);
          if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

          // Also set cookie so proxy middleware can read it
          setCookie('accessToken', accessToken, 7);

          set({ user, accessToken, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          const msg = error.response?.data?.error || error.message || 'Login failed';
          throw new Error(msg);
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          await api.auth.register(data);
          set({ isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          const msg = error.response?.data?.error || error.message || 'Registration failed';
          throw new Error(msg);
        }
      },

      logout: async () => {
        try {
          await api.auth.logout();
        } catch { /* ignore */ }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      updateUser: (userData) =>
        set(state => ({ user: state.user ? { ...state.user, ...userData } : null })),

      clearAuth: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'yoyzie-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
