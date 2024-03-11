import { notifications } from '@/components/notifications';
import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const useAuth = () => {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const signIn = async (email: string, password: string): Promise<void> => {
    const result = await doApiAction<GenericAPIResponse>({
      endpoint: '/auth/signin',
      method: 'POST',
      body: {
        email,
        password,
      },
    });

    if (result?.status === 202) {
      navigate({
        to: '/app/home',
      });
    } else {
      notifications.add({
        message: t(result?.message ?? 'notifications:genericError'),
        autoClose: 5000,
      });
    }
  };

  const signOut = async () => {
    await doApiAction({
      method: 'POST',
      endpoint: '/auth/signout',
    });
    navigate({
      to: '/',
    });
  };

  return {
    signIn,
    signOut,
    user,
    loading,
  };
};
