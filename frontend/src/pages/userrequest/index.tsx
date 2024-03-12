import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { UserRequestForm } from './components/UserRequestForm';
import { PublicPageWrapper } from '@/components/publicpagewrapper';
import { UserRequestFooter } from './components/UserRequestFooter';

export const UserRequestPage: FC = () => {
  const { t } = useTranslation();

  return (
    <PublicPageWrapper
      title={t('userRequestForm:title')}
      panelWidth='110vh'
      footer={<UserRequestFooter />}
      hideBackButton
    >
      <UserRequestForm />
    </PublicPageWrapper>
  );
};
