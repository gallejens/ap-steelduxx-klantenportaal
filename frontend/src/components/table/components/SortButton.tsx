import { ActionIcon } from '@mantine/core';
import styles from '../styles/table.module.scss';
import type { NTable } from '../types';
import {
  IconArrowNarrowDown,
  IconArrowNarrowUp,
  IconArrowsSort,
} from '@tabler/icons-react';

type Props<T> = {
  columnKey: T;
  onClick: (columnKey: T) => void;
  sort: NTable.Sort<T>;
};

export const SortButton = <T extends string>(props: Props<T>) => {
  return (
    <ActionIcon
      variant='transparent'
      size='xs'
      onClick={() => props.onClick(props.columnKey)}
      className={styles.sort_button}
    >
      {props.sort.column === props.columnKey ? (
        props.sort.direction === 'asc' ? (
          <IconArrowNarrowDown />
        ) : (
          <IconArrowNarrowUp />
        )
      ) : (
        <IconArrowsSort />
      )}
    </ActionIcon>
  );
};
