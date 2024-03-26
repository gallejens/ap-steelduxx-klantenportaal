import React, { useState, useEffect } from 'react';
import { Popover } from '@mantine/core';
import { IconMessage } from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';
import CustomCard from './Notificationcard';

export function NotificationPopover() {
  type NotificationData = {
    id: number;
    createdAt: any;
    color?: string;
    icon?: React.ReactNode;
    title?: string;
    message: string;
    loading?: boolean;
    hideCloseButton?: boolean;
    autoClose?: number;
    isRead: boolean;
  };

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [newNotifications, setNewNotifications] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 2000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications/user/new/${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setNewNotifications(data.length > 0);
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleIconClick = async (notificationId: number) => {
    try {
      const response = await fetch(
        `/api/notifications/${notificationId}/read`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isRead: true }),
        }
      );
      if (response.ok) {
        // Remove the notification from the list once marked as read
        setNotifications(prevNotifications =>
          prevNotifications.filter(
            notification => notification.id !== notificationId
          )
        );
        setNewNotifications(false);
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
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
        <div onClick={fetchNotifications}>
          <IconMessage color={newNotifications ? 'red' : 'white'} />{' '}
        </div>
      </Popover.Target>
      <Popover.Dropdown bg='var(--mantine-color-body)'>
        <div>
          {notifications.map(
            (notification: NotificationData, index: number) => (
              <div key={index}>
                <CustomCard
                  title={notification.title}
                  message={notification.message}
                  datetime={notification.createdAt}
                  onClick={() => handleIconClick(notification.id)}
                />
              </div>
            )
          )}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}
