import { type FC, useState } from 'react';
import { Input, Select } from '@mantine/core';
import { OrderList } from './components/orderList';
import styles from './styles/orderList.module.scss';

export const OrderListPage: FC = () => {
  const [pageSize, setPageSize] = useState<number>(7);

  return (
    <div className={styles.orderlist_table_page}>
      <div className={styles.header}>
        <div className={styles.first_column}>
          <Select
            className={styles.paging_select}
            value={pageSize.toString() ?? ''}
            data={['3', '5', '7']}
            onChange={value => setPageSize(parseInt(value ?? '0', 10))}
            allowDeselect={false}
          />
        </div>
        <div className={styles.second_column}>
          <Input
            className={styles.search_bar}
            placeholder='Search'
            radius='sm'
          />
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.orderlist_table}>
          <OrderList pageSize={pageSize} />
        </div>
      </div>
    </div>
  );
};
