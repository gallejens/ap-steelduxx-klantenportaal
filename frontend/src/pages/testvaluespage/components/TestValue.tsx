import { ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import type { FC } from 'react';
import styles from '../styles/testvaluespage.module.scss';

type Props = { value: string; onDelete: () => void };

export const TestValue: FC<Props> = props => {
  return (
    <div className={styles.item}>
      <p>{props.value}</p>
      <ActionIcon onClick={props.onDelete}>
        <IconX />
      </ActionIcon>
    </div>
  );
};
