import { Text } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import type { FC } from 'react';
import styles from '../styles/passwordinputwithrequirements.module.scss';

type Props = {
  label: string;
  fulfilled: boolean;
};

export const PasswordRequirement: FC<Props> = props => {
  return (
    <Text
      className={styles.password_requirement}
      c={props.fulfilled ? 'teal' : 'red'}
    >
      {props.fulfilled ? (
        <IconCheck className={styles.icon} />
      ) : (
        <IconX className={styles.icon} />
      )}
      {props.label}
    </Text>
  );
};
