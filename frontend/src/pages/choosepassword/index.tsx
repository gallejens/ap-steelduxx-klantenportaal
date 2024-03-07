import { PublicPageWrapper } from '@/components/publicpagewrapper';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ChoosePasswordForm } from './components/ChoosePasswordForm';
import { useSearch } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { type GenericAPIResponse, doApiAction } from '@/lib/api';
import { Loader, Text } from '@mantine/core';

export const ChoosePasswordPage: FC = () => {
  const { t } = useTranslation();
  const { token } = useSearch({
    from: '/choose-password',
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

  return (
    <PublicPageWrapper
      title={t('choosePasswordPage:title')}
      panelWidth='55vh'
    >
      {status === 'pending' ? (
        <Loader />
      ) : tokenEmail === undefined ? (
        <Text>Invalid token</Text>
      ) : (
        <ChoosePasswordForm email={tokenEmail} />
      )}
    </PublicPageWrapper>
  );
};
