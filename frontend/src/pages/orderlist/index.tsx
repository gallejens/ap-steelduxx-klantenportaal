import { useState, type FC } from 'react';
import { Badge, TextInput } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import styles from './styles/orderList.module.scss';
import { IconSearch } from '@tabler/icons-react';
import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Table } from '@/components/table';
import type { Order } from '@/types/api';
import { getOrderStateColor, getOrderTransportTypeColor } from './helpers';

export const OrderListPage: FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    data: orders,
    status,
    error,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: () =>
      doApiAction<GenericAPIResponse<Order[]>>({
        endpoint: '/orders/all',
        method: 'GET',
      }),
  });

  const handleOrderClick = (order: Order) => {
    navigate({
      to: '/app/orders/$order_id',
      params: {
        order_id: order.referenceNumber,
      },
      search: {
        customerCode: order.customerCode ?? undefined,
      },
    });
  };

  if (status === 'pending') {
    return <div>{t('orderListPage:loading')}</div>;
  }

  if (status === 'error' || !orders) {
    return (
      <div>
        {t('orderListPage:error')} | {error?.message ?? 'Unknown Error'}
      </div>
    );
  }

  return (
    <div className={styles.order_list_page}>
      <div className={styles.header}>
        <TextInput
          leftSection={<IconSearch />}
          value={searchValue}
          onChange={e => setSearchValue(e.currentTarget.value)}
        />
      </div>
      <div className={styles.body}>
        <Table
          storageKey='table_orderlist'
          translationKey='orderListPage:table'
          searchValue={searchValue}
          onRowClick={handleOrderClick}
          columns={[
            {
              key: 'referenceNumber',
              defaultSort: true,
            },
            {
              key: 'customerReferenceNumber',
            },
            {
              key: 'state',
              transform: (value: Order['state']) => {
                return <Badge color={getOrderStateColor(value)}>{value}</Badge>;
              },
            },
            {
              key: 'transportType',
              transform: (value: Order['transportType']) => {
                return (
                  <Badge color={getOrderTransportTypeColor(value)}>
                    {value}
                  </Badge>
                );
              },
            },
            {
              key: 'portOfOriginCode',
            },
            {
              key: 'portOfOriginName',
            },
            {
              key: 'portOfDestinationCode',
            },
            {
              key: 'portOfDestinationName',
            },
            {
              key: 'shipName',
            },
            {
              key: 'ets',
              excludeFromSearch: true,
            },
            {
              key: 'ats',
              excludeFromSearch: true,
            },
            {
              key: 'eta',
              excludeFromSearch: true,
            },
            {
              key: 'ata',
              excludeFromSearch: true,
            },
            {
              key: 'totalWeight',
            },
            {
              key: 'totalContainers',
            },
            {
              key: 'containerTypes',
              excludeFromSearch: true,
            },
          ]}
          data={orders.data}
        />
      </div>
    </div>
  );
};
