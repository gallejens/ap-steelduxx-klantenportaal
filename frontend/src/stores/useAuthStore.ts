import type { Auth } from '@/types/auth';
import { create } from 'zustand';

type AuthState = {
  user: Auth.User | null;
  loading: Promise<void> | null;
};

type AuthStateActions = {
  setUser: (user: AuthState['user']) => void;
  setLoading: (loading: AuthState['loading']) => void;
  getUserInfo: () => Promise<AuthState['user']>;
};

export const useAuthStore = create<AuthState & AuthStateActions>(
  (set, get) => ({
    user: null,
    loading: null,
    setUser: user => set({ user }),
    setLoading: loading => set({ loading }),
    getUserInfo: async () => {
      if (get().loading !== null) {
        await get().loading;
      }
      return get().user;
    },
  })
);
