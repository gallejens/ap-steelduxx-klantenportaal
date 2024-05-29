import type { FC } from 'react';
import { Title } from '@mantine/core';
import styles from '../styles/home.module.scss';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

export const Header: FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className={styles.header}>
      <Title order={1}>
        {t('homePage:title')} {user?.firstName} {user?.lastName}
      </Title>
    </div>
  );
};
