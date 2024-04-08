import { Card } from '@mantine/core';
import styles from '../styles/notificationspopover.module.scss';
import { IconCircleCheck } from '@tabler/icons-react';

interface CustomNotificationCardProps {
  title: any;
  message: any;
  datetime: any;
  onClick: () => void;
}

export default function CustomCard({
  title,
  message,
  datetime,
  onClick,
}: CustomNotificationCardProps) {
  return (
    <Card className={styles.card}>
      <div className={styles.title}>{title}</div>
      <div className={styles.message}>{message}</div>
      <div className={styles.datetime}>{datetime}</div>
      <IconCircleCheck
        className={styles['check-icon']}
        onClick={onClick}
      />
    </Card>
  );
}
