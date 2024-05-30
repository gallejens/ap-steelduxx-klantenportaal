import { Paper, Text, Title } from '@mantine/core';
import styles from '../styles/notificationspopover.module.scss';
import { IconTrash } from '@tabler/icons-react';
import type { FC } from 'react';

type Props = {
  title: any;
  message: any;
  datetime: number;
  onClick: () => void;
};

const formatDatetime = (timestamp: number) => {
  const date = new Date(timestamp);

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

export const NotificationCard: FC<Props> = ({
  title,
  message,
  datetime,
  onClick,
}) => {
  return (
    <Paper className={styles.card}>
      <div className={styles.info}>
        <Title order={6}>{title}</Title>
        <Text size='xs'>{message}</Text>
        <Text
          size='xs'
          c='dimmed'
          fs='italic'
          className={styles.datetime}
        >
          {formatDatetime(datetime)}
        </Text>
      </div>
      <div className={styles.icon}>
        <IconTrash onClick={onClick} />
      </div>
    </Paper>
  );
};
