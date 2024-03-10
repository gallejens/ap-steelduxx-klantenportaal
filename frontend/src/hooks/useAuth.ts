import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Auth } from '@/types/auth';

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useAuthStore();

  const fetchUserInfo = async () => {
    let loadingPromiseResolver: () => void = () => {};
    const loadingPromise = new Promise<void>(resolve => {
      loadingPromiseResolver = resolve;
    });
    setLoading(loadingPromise);

    console.log('Fetching user info!');
    const user = await doApiAction<GenericAPIResponse<Auth.User>>({
      method: 'GET',
      endpoint: '/auth/info',
    });

    const userInfo = user?.data ?? null;
    setUser(userInfo);

    loadingPromiseResolver();
    setLoading(null);
  };

  const signin = () => {
    //
  };

  const signout = () => {
    //
  };

  return {
    signin,
    signout,
    user,
    loading,
    fetchUserInfo,
  };
};
