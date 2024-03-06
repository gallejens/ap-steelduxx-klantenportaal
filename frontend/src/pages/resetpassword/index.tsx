import { PublicPageWrapper } from '@/components/publicpagewrapper';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ResetPasswordForm } from './components/ResetPasswordForm';

export const ResetPasswordPage: FC = () => {
  const { t } = useTranslation();

  return (
    <PublicPageWrapper
      title={t('resetPasswordPage:title')}
      panelWidth='55vh'
    >
      <ResetPasswordForm />
    </PublicPageWrapper>
  );
};
