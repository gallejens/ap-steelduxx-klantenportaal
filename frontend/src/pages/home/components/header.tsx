import type { FC } from 'react';
import { Text } from '@mantine/core';
import { t } from 'i18next';
import styles from '../styles/home.module.scss';
import { useAuth } from '@/hooks/useAuth';

export const Header: FC = () => {
  const { user } = useAuth();
  // if (user === null) return null;

  return (
    <div className={styles.header}>
      <Text
        size={'35'}
        fw={700}
        inline={true}
      >
        {t('welcomePage:welcomeTitle')} {user?.firstName} {user?.lastName}
      </Text>
    </div>
  );
};
