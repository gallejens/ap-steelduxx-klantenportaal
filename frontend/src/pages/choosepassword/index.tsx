import { PublicPageWrapper } from '@/components/publicpagewrapper';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ChoosePasswordForm } from './components/ChoosePasswordForm';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { type GenericAPIResponse, doApiAction } from '@/lib/api';
import { Loader, Text } from '@mantine/core';
import styles from './styles/choosepassword.module.scss';
import { notifications } from '@/components/notifications';

export const ChoosePasswordPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useSearch({
    from: '/unauthorized-only-route/choose-password',
  });

  const { data: response, status } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['choosePasswordTokenEmail'],
    queryFn: () =>
      doApiAction<GenericAPIResponse<{ email: string } | null>>({
        endpoint: `/auth/choose-password/${token}`,
        method: 'GET',
      }),
  });

  const tokenEmail = response?.data?.email;

  const handleChoosePassword = async (password: string) => {
    const response = await doApiAction<GenericAPIResponse>({
      endpoint: '/auth/choose-password',
      method: 'POST',
      body: {
        token,
        password,
      },
    });

    if (!response) {
      notifications.add({
        message: t('notifications:genericError'),
        color: 'red',
      });
      return;
    }

    notifications.add({
      message: t(`choosePasswordPage:response:${response.message}`),
      autoClose: 5000,
    });

    if (response.status === 200) {
      navigate({
        to: '/login',
      });
    }
  };

  return (
    <PublicPageWrapper
      title={t('choosePasswordPage:title')}
      panelWidth='55vh'
      hideBackButton
    >
      {status === 'pending' ? (
        <Loader />
      ) : tokenEmail === undefined ? (
        <Text>{t('choosePasswordPage:invalidToken')}</Text>
      ) : (
        <>
          <Text className={styles.email_text}>
            {t('choosePasswordPage:tokenEmailFeedback')}
            {tokenEmail}
          </Text>
          <ChoosePasswordForm onSubmit={handleChoosePassword} />
        </>
      )}
    </PublicPageWrapper>
  );
};
