import { PublicPageWrapper } from '@/components/publicpagewrapper';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ChoosePasswordForm } from './components/ChoosePasswordForm';
import { useSearch } from '@tanstack/react-router';

export const ChoosePasswordPage: FC = () => {
  const { t } = useTranslation();
  const search = useSearch({
    from: '/choose-password',
  });

  console.log(search.token);

  // TODO: Backend API call to verify the token and email
  const email = 'lejajea@gmail.com';

  return (
    <PublicPageWrapper
      title={t('choosePasswordPage:title')}
      panelWidth='55vh'
    >
      <ChoosePasswordForm email={email} />
    </PublicPageWrapper>
  );
};
