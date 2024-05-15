import { useState, type FC } from 'react';
import { Badge, Button } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import styles from './styles/orderList.module.scss';
import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Table } from '@/components/table';
import type { Order } from '@/types/api';
import { getOrderStateColor, getOrderTransportTypeColor } from './helpers';
import { useAuth } from '@/hooks/useAuth';
import { MultiSearch } from '@/components/multisearch';

export const OrderListPage: FC = () => {
  const [searchValues, setSearchValues] = useState<string[]>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

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
        <MultiSearch
          onChange={newValues => setSearchValues(newValues)}
          inputWidth='30rem'
        />
        {user?.permissions.includes('CREATE_NEW_ORDERS') && (
          <Button
            type='submit'
            onClick={() => {
              navigate({ to: '/app/orders/new' });
            }}
            className={styles.new_button}
          >
            {t('orderListPage:header:newOrder')}
          </Button>
        )}
      </div>
      <div className={styles.body}>
        <Table
          storageKey='table_orderlist'
          translationKey='orderListPage:table'
          searchValue={searchValues}
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
              key: 'totalContainers',
            },
            {
              key: 'containerTypes',
              transform: (value: string[] | null) => {
                if (value && value.length > 0) {
                  return value.join(' / ');
                } else {
                  return 'N/A';
                }
              },
            },
            {
              key: 'totalWeight',
            },
            {
              key: 'shipName',
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
              key: 'state',
              transform: (value: Order['state']) => {
                return <Badge color={getOrderStateColor(value)}>{value}</Badge>;
              },
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
          ]}
          data={orders.data}
        />
      </div>
    </div>
  );
};
