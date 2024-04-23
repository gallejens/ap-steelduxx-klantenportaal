import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TextInput } from '@mantine/core';
import { Table } from '@/components/table';
import { doApiAction } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { STATUSES } from './constants';
import styles from './styles/orderRequestList.module.scss';
import type { OrderRequest } from '@/types/api';
import { IconSearch } from '@tabler/icons-react';

export const OrderRequestListPage: FC = () => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState<string>('');
  const { data: orderRequests, status } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['orderRequestListValues'],
    queryFn: () =>
      doApiAction<OrderRequest[]>({
        endpoint: '/order-requests/all',
        method: 'GET',
      }),
  });

  console.log('orderRequests:', orderRequests);
  console.log('status:', status);

  if (status === 'pending' || status === 'error' || orderRequests == null) {
    return <div>{t('orderRequestListPage:loading')}</div>;
  }

  const tableData = Object.values(orderRequests).reduce<
    Partial<
      Record<
        OrderRequest['status'],
        {
          id: string;
          customerCode: string;
          transportType: string;
          portOfOriginCode: string;
          portOfDestinationCode: string;
        }[]
      >
    >
  >((acc, orderRequest) => {
    const requestsForStatus = (acc[orderRequest.status] ??= []);
    requestsForStatus.push({
      id: `#${orderRequest.id}`,
      customerCode: orderRequest.customerCode,
      transportType: orderRequest.transportType,
      portOfOriginCode: orderRequest.portOfOriginCode,
      portOfDestinationCode: orderRequest.portOfDestinationCode,
    });
    return acc;
  }, {});
  console.log(tableData);
  return (
    <div className={styles.orderrequest_list_page}>
      <div className={styles.header}>
        <TextInput
          className={styles.search_bar}
          leftSection={<IconSearch />}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
      </div>
      <Tabs
        defaultValue={STATUSES[0]}
        variant='outline'
        className={styles.body}
      >
        <Tabs.List>
          {STATUSES.map(status => (
            <Tabs.Tab
              key={status}
              value={status}
              leftSection={
                status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
              }
            />
          ))}
        </Tabs.List>
        {STATUSES.map(status => (
          <Tabs.Panel
            key={status}
            value={status}
            className={styles.orderrequest_table}
          >
            <Table
              searchValue={searchValue}
              storageKey='orderrequest_list'
              translationKey='orderRequestListPage:table'
              columns={[
                { key: 'id', defaultSort: true },
                { key: 'customerCode', initialWidth: 200 },
                { key: 'transportType', initialWidth: 150 },
                { key: 'portOfOriginCode', initialWidth: 150 },
                { key: 'portOfDestinationCode', initialWidth: 150 },
              ]}
              data={tableData[status] ?? []}
            />
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
};
