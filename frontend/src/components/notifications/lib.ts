const dispatchNotificationEvent = (eventData: NotificationEvent) => {
  const event = new CustomEvent<NotificationEvent>('notification', {
    detail: eventData,
  });
  window.dispatchEvent(event);
};

export const notifications = {
  add: (notification: NotificationData) => {
    dispatchNotificationEvent({
      action: 'add',
      notification,
    });
  },
  clear: () => {
    dispatchNotificationEvent({
      action: 'clear',
    });
  },
};

export type NotificationEvent =
  | {
      action: 'add';
      notification: NotificationData;
    }
  | {
      action: 'clear';
    };

export type NotificationData = {
  color?: string;
  icon?: React.ReactNode;
  title?: string;
  message: string;
  loading?: boolean;
  hideCloseButton?: boolean;
  autoClose?: number;
};
