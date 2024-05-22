import type { TablerIconsProps } from '@tabler/icons-react';
import type { FC } from 'react';
import { Text } from '@mantine/core';
import styles from './styles/iconlistitem.module.scss';

type Props = {
  icon: FC<TablerIconsProps>;
  text: string | number;
};

export const IconListItem: FC<Props> = props => {
  return (
    <div className={styles.icon_list_item}>
      <props.icon size={20} />
      <Text
        size='sm'
        truncate='end'
      >
        {props.text}
      </Text>
    </div>
  );
};
