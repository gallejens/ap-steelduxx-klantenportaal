import type { FC } from 'react';
import { Title } from '@mantine/core';
import { t } from 'i18next';
import styles from '../styles/home.module.scss';
import { useAuth } from '@/hooks/useAuth';

export const Header: FC = () => {
  const { user } = useAuth();

  return (
    <div className={styles.header}>
      <Title order={1}>
        {t('homePage:title')} {user?.firstName} {user?.lastName}
      </Title>
    </div>
  );
};
