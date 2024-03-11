import type { Auth } from '@/types/auth';
import { create } from 'zustand';

type AuthState = {
  user: Auth.User | null;
  loading: boolean;
};

type AuthStateActions = {
  setUser: (user: AuthState['user']) => void;
  setLoading: (loading: AuthState['loading']) => void;
  getUserInfo: () => Promise<AuthState['user']>;
};

export const useAuthStore = create<AuthState & AuthStateActions>(
  (set, get) => ({
    user: null,
    loading: true, // default to true for page load
    setUser: user => set({ user, loading: false }),
    setLoading: loading => set({ loading }),
    getUserInfo: async () => {
      if (get().loading) {
        await new Promise<void>(resolve => {
          const t = setInterval(() => {
            if (!get().loading) {
              clearInterval(t);
              resolve();
            }
          });
        });
      }
      return get().user;
    },
  })
);
