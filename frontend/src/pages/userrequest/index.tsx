import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { UserRequestForm } from './components/UserRequestForm';
import { PublicPageWrapper } from '@/components/publicpagewrapper';
import { UserRequestFooter } from './components/UserRequestFooter';
import { Text } from '@mantine/core';

export const UserRequestPage: FC = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  return (
    <PublicPageWrapper
      title={t('userRequestForm:title')}
      panelWidth={submitted ? '55vh' : '110vh'}
      footer={submitted ? undefined : <UserRequestFooter />}
      hideLanguageSelector={submitted}
    >
      {submitted ? (
        <Text>{t('userRequestForm:success')}</Text>
      ) : (
        <UserRequestForm
          onSuccess={() => {
            setSubmitted(true);
          }}
        />
      )}
    </PublicPageWrapper>
  );
};
