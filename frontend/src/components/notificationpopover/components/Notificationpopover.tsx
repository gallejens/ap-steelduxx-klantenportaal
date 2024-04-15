import { Center, Popover, Text } from '@mantine/core';
import { IconMessage } from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';
import CustomCard from './Notificationcard';
import { type NotificationData } from '../types/notificationdata';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { doApiAction } from '@/lib/api';
import { useTranslation } from 'react-i18next';

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
    refetchInterval: 2000,
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

  if (status === 'error' || !notifications) {
    return <div>Error: {error?.message ?? 'Unknown Error'}</div>;
  }

  return (
    <Popover
      width={300}
      position='bottom'
      withArrow
      shadow='md'
      offset={{ mainAxis: 10, crossAxis: -50 }}
    >
      <Popover.Target>
        <div>
          <IconMessage
            color={
              notifications?.length ? 'red' : 'var(--mantine-color-primary-0)'
            }
          />
        </div>
      </Popover.Target>
      <Popover.Dropdown bg='var(--mantine-color-body)'>
        <div>
          {notifications.length === 0 ? (
            <Center>
              <Text>{t('notifications:noNotifications')}</Text>
            </Center>
          ) : (
            notifications.map(
              (notification: NotificationData, index: number) => (
                <div key={index}>
                  <CustomCard
                    title={notification.title}
                    message={notification.message}
                    datetime={notification.createdAt}
                    onClick={() => readMutation.mutate(notification.id)}
                  />
                </div>
              )
            )
          )}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}
