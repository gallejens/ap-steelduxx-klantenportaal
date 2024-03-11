import { Text } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/userRequest.module.scss';

export const UserRequestFooter: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={styles.userrequest_page_footer}>
      <Text c='dimmed'>{t('userrequestpage:userRequestLabel')}</Text>
      <Text
        c='dimmed'
        onClick={() => {
          navigate({ to: '/login' });
        }}
        className={styles.login_link}
      >
        {t('userrequestpage:loginLink')}
      </Text>
    </div>
  );
};
