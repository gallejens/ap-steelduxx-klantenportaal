import { Center, Indicator, Popover, Text } from '@mantine/core';
import { IconMessage } from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';
import { NotificationCard } from './Notificationcard';
import { type NotificationData } from '../types/notificationdata';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { doApiAction } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@/components/iconbutton';
import styles from '../styles/notificationspopover.module.scss';

export function NotificationPopover() {
  const { user } = useAuth();
  const client = useQueryClient();
  const { t } = useTranslation();

  const {
    data: notifications,
    status,
    error,
  } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['notifications', user?.id],
    refetchInterval: 60 * 1000,
    queryFn: () =>
      doApiAction<NotificationData[]>({
        endpoint: `notifications/user/new/${user?.id}`,
        method: 'GET',
      }),
  });

  const readMutation = useMutation({
    mutationFn: (id: number) => {
      return doApiAction({
        endpoint: `/notifications/${id}/read`,
        method: 'PUT',
        body: { isRead: true },
      });
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  if (status === 'pending') {
    return <div>Loading...</div>;
  }

  if (status === 'error' || !notifications || !Array.isArray(notifications)) {
    return <div>Error: {error?.message ?? 'Unknown Error'}</div>;
  }

  return (
    <Popover
      width={400}
      position='bottom'
      withArrow
      shadow='md'
      offset={{ mainAxis: 10, crossAxis: -100 }}
    >
      <Popover.Target>
        <IconButton
          tooltipKey='appshell:header:tooltips:notifications'
          icon={
            <Indicator
              color='red'
              size='12'
              radius='xl'
              offset={6}
              processing
              disabled={notifications.length === 0}
            >
              <IconMessage color={'var(--mantine-color-primary-0)'} />
            </Indicator>
          }
          transparent
        />
      </Popover.Target>
      <Popover.Dropdown bg='var(--mantine-color-body)'>
        <div className={styles.notification_list}>
          {notifications.length === 0 ? (
            <Center>
              <Text>{t('notifications:noNotifications')}</Text>
            </Center>
          ) : (
            notifications.map((notification: NotificationData, idx: number) => (
              <NotificationCard
                key={idx}
                title={notification.title}
                message={notification.message}
                datetime={notification.createdAt}
                onClick={() => readMutation.mutate(notification.id)}
              />
            ))
          )}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}
