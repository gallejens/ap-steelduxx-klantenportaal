import React, { useState, useEffect } from 'react';
import { List, Popover, ThemeIcon, rem } from '@mantine/core';
import { IconCircleCheck, IconMessage } from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';

export function NotificationPopover() {
  type NotificationData = {
    createdAt: any;
    color?: string;
    icon?: React.ReactNode;
    title?: string;
    message: string;
    loading?: boolean;
    hideCloseButton?: boolean;
    autoClose?: number;
  };

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotifications(user.id);
    }
  }, [user]);

  const fetchNotifications = async (userId: number) => {
    try {
      const response = await fetch(`/api/notifications/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        const latestNotifications = data.slice(0, 5);
        setNotifications(latestNotifications);
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleIconClick = () => {
    if (user) {
      fetchNotifications(user.id);
    }
  };

  return (
    <Popover
      width={300}
      position='bottom'
      withArrow
      shadow='md'
      offset={{ mainAxis: 10, crossAxis: -50 }}
    >
      <Popover.Target>
        <div onClick={handleIconClick}>
          <IconMessage />
        </div>
      </Popover.Target>
      <Popover.Dropdown bg='var(--mantine-color-body)'>
        <List
          spacing='xs'
          size='sm'
          center
          icon={
            <ThemeIcon
              color='teal'
              size={24}
              radius='xl'
            >
              <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
            </ThemeIcon>
          }
        >
          {notifications.map(
            (notification: NotificationData, index: number) => (
              <List.Item key={index}>{notification.message}</List.Item>
            )
          )}
        </List>
      </Popover.Dropdown>
    </Popover>
  );
}
