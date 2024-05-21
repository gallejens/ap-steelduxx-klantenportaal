import { useMemo, type FC } from 'react';
import { Text, Paper } from '@mantine/core';
import styles from '../styles/home.module.scss';
import { useAuth } from '@/hooks/useAuth';
import { TABS } from '@/tabs';
import { t } from 'i18next';
import { useNavigate } from '@tanstack/react-router';

export const Body: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const visibleCards = useMemo(() => {
    return TABS.filter(
      tab =>
        tab.showOnHomepage &&
        (!tab.requiredPermission ||
          user?.permissions.includes(tab.requiredPermission))
    );
  }, [user?.permissions]);

  return (
    <div className={styles.body}>
      {visibleCards.map(card => (
        <Paper
          key={card.path}
          className={styles.card}
          onClick={() => {
            navigate({
              to: card.path as string,
            });
          }}
        >
          <div className={styles.icon}>
            <card.icon
              size={64}
              color={`rgb(${card.color.r}, ${card.color.g}, ${card.color.b})`}
            />
          </div>
          <Text>{t(`homePage:cards:${card.labelKey}:title`)}</Text>
          <Text
            size='sm'
            c='dimmed'
          >
            {t(`homePage:cards:${card.labelKey}:description`)}
          </Text>
        </Paper>
      ))}
    </div>
  );
};
