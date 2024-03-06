import { Text } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/login.module.scss';

export const LoginFooter: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={styles.login_page_footer}>
      <Text c='dimmed'>{t('loginpage:noAccountLabel')}</Text>
      <Text
        c='dimmed'
        onClick={() => {
          navigate({ to: '/request_account' });
        }}
        className={styles.userrequest_link}
      >
        {t('loginpage:userrequestLink')}
      </Text>
    </div>
  );
};
