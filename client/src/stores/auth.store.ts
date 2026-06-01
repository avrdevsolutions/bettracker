import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '@/types/api';

type AuthUser = {
  userId: string;
  email: string;
  role: UserRole;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: 'bettracker-auth' },
  ),
);
