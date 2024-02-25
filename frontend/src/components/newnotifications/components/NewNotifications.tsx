import { useEffect, useState } from 'react';

interface Notification {
  id: number;
  title: string;
  message: string;
  date: Date;
  read: boolean;
}

export const NotificationsComponent = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetch('/notifications')
      .then(response => response.json())
      .then(data => setNotifications(data));
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.map(notification => (
        <div key={notification.id}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
};