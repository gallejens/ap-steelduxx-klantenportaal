import { Text } from '@mantine/core';
import styles from '../styles/table.module.scss';
import { IconEyeOff, IconEye } from '@tabler/icons-react';

type Props<T extends string> = {
  columns: { label: string; key: T; disabled?: boolean }[];
  onClick: (column: T) => void;
};

export const ColumnSelector = <T extends string>(props: Props<T>) => {
  return (
    <div className={styles.column_selector}>
      {props.columns.map(column => (
        <div
          key={`column_selector_${column.key}`}
          onClick={() => props.onClick(column.key)}
        >
          {column.disabled ? <IconEyeOff /> : <IconEye />}
          <Text truncate='end'>{column.label}</Text>
        </div>
      ))}
    </div>
  );
};
