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
  const formatDatetime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedDay}-${formattedMonth}-${year} ${formattedHours}:${formattedMinutes}`;
  };

  return (
    <Card className={styles.card}>
      <div className={styles.title}>{title}</div>
      <div className={styles.message}>{message}</div>
      <div className={styles.datetime}>{formatDatetime(datetime)}</div>
      <IconCircleCheck
        className={styles['check-icon']}
        onClick={onClick}
      />
    </Card>
  );
}
