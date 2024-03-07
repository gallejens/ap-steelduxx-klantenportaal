import { PublicPageWrapper } from '@/components/publicpagewrapper';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ResetPasswordForm } from './components/ResetPasswordForm';
import { Text } from '@mantine/core';

export const ResetPasswordPage: FC = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  return (
    <PublicPageWrapper
      title={t('resetPasswordPage:title')}
      panelWidth='55vh'
    >
      {submitted ? (
        <Text>{t('resetPasswordPage:feedback')}</Text>
      ) : (
        <ResetPasswordForm
          onSubmit={() => {
            setSubmitted(true);
          }}
        />
      )}
    </PublicPageWrapper>
  );
};
