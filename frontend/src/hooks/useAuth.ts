import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Auth } from '@/types/auth';

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useAuthStore();

  const fetchUserInfo = async () => {
    setLoading(true);

    const user = await doApiAction<GenericAPIResponse<Auth.User>>({
      method: 'GET',
      endpoint: '/auth/info',
    });

    const userInfo = user?.data ?? null;
    setUser(userInfo);
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: true } | { success: false; message: string }> => {
    const result = await doApiAction<GenericAPIResponse>({
      endpoint: '/auth/signin',
      method: 'POST',
      body: {
        email,
        password,
      },
    });

    if (result?.status === 202) {
      await fetchUserInfo();
      return { success: true };
    } else {
      return {
        success: false,
        message: result?.message ?? 'notifications:genericError',
      };
    }
  };

  const signOut = async () => {
    await doApiAction({
      method: 'POST',
      endpoint: '/auth/signout',
    });
    await fetchUserInfo();
  };

  return {
    signIn,
    signOut,
    user,
    loading,
    fetchUserInfo,
  };
};
