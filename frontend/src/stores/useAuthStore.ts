import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import type { Auth } from '@/types/auth';
import { create } from 'zustand';

type AuthState = {
  user: Auth.User | null;
  loading: boolean;
};

type AuthStateActions = {
  setUser: (user: AuthState['user']) => void;
  setLoading: (loading: AuthState['loading']) => void;
  fetchUserInfo: () => Promise<AuthState['user']>;
};

export const useAuthStore = create<AuthState & AuthStateActions>(
  (set, get) => ({
    user: null,
    loading: false,
    setUser: user => set({ user, loading: false }),
    setLoading: loading => set({ loading }),
    fetchUserInfo: async () => {
      get().setLoading(true);
      const response = await doApiAction<GenericAPIResponse<Auth.User>>({
        method: 'GET',
        endpoint: '/auth/info',
      });
      const user = response?.data ?? null;
      get().setUser(user);
      return user;
    },
  })
);
