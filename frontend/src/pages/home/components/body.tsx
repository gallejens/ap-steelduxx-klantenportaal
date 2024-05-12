import { useMemo, type FC } from 'react';
import { Card, Text, Group, Center } from '@mantine/core';
import styles from '../styles/home.module.scss';
import { useAuth } from '@/hooks/useAuth';
import { CARDS } from '../constant';
import { t } from 'i18next';
import { useNavigate } from '@tanstack/react-router';

export const Body: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const visibleCARDS = useMemo(() => {
    return CARDS.filter(
      tab =>
        !tab.requiredPermission ||
        user?.permissions.includes(tab.requiredPermission)
    );
  }, [user?.permissions]);

  return (
    <div className={styles.body}>
      <div className={styles.cardContainer}>
        {visibleCARDS.map(card => (
          <Card
            key={card.path}
            shadow='sm'
            padding='lg'
            radius='md'
            withBorder
            className={styles.card}
          >
            <Card.Section
              component='a'
              className={styles.iconContainer}
              onClick={() => {
                navigate({
                  to: card.path as string,
                });
              }}
            >
              <Center>
                <card.icon
                  width={200}
                  size={64}
                  color={`rgb(${card.color.r}, ${card.color.g}, ${card.color.b})`}
                />
              </Center>
            </Card.Section>
            <Group
              justify='space-between'
              mt='md'
              mb='xs'
            >
              <Text
                fw={500}
                className={styles.cardTitle}
              >
                {t(`welcomePage:cards:${card.labelKey}:title`)}
              </Text>
            </Group>
            <Text
              size='sm'
              c='dimmed'
              className={styles.cardDescription}
            >
              {t(`welcomePage:cards:${card.labelKey}:description`)}
            </Text>
          </Card>
        ))}
      </div>
    </div>
  );
};
