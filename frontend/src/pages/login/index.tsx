import { SteelLogo } from '@/components/steellogo';
import { Divider, Text } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginForm } from './components/LoginForm';
import styles from './styles/login.module.scss';

export const LoginPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={styles.login_page}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <Text>{t('loginpage:title')}</Text>
        </div>
        <Divider />
        <div className={styles.body}>
          <SteelLogo width='35%' className={styles.logo} />
          <LoginForm />
        </div>
        <Divider />
        <div className={styles.footer}>
          <Text c='dimmed'>{t('loginpage:noAccountLabel')}</Text>
          <Text
            c='dimmed'
            onClick={() => {
              navigate({ to: '/testvalues' });
            }}
            className={styles.register_link}
          >
            {t('loginpage:registerLink')}
          </Text>
        </div>
      </div>
    </div>
  );
};
