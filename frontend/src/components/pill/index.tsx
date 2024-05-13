import type { FC } from 'react';
import styles from './styles/pill.module.scss';
import { IconX } from '@tabler/icons-react';
import { Text } from '@mantine/core';

type Props = {
  text: string;
  onRemove: () => void;
};

export const Pill: FC<Props> = ({ text, onRemove }) => {
  return (
    <div className={styles.pill}>
      <Text size='sm'>{text}</Text>
      {!!onRemove && (
        <IconX
          size='16px'
          className={styles.icon}
        />
      )}
    </div>
  );
};
