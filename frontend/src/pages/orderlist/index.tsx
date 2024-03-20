import { useState, type FC } from 'react';
import { Badge, TextInput } from '@mantine/core';
import styles from './styles/orderList.module.scss';
import { IconSearch } from '@tabler/icons-react';
import { doApiAction } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Table } from '@/components/table';

type Order = {
  referenceNumber: string; // ex: "2646607000",
  customerReferenceNumber: string; // ex: "SRL/BHJ/EXP/PI-154",
  state: 'SAILING' | 'PLANNED' | 'CREATED' | 'ARRIVED' | 'CLOSED' | 'LOADED';
  transportType: 'IMPORT' | 'EXPORT';
  portOfOriginCode: string; // ex: "INMUN",
  portOfDestinationCode: string; // ex: "BEANR",
  shipName: string; // ex: "EDISON",
  ets: string | null; // ex: "07-03-2024 11:58",
  ats: string | null; // ex: "07-03-2024 23:58",
  eta: string | null; // ex: "27-03-2024 11:58",
  ata: string | null; // ex: null
};

const getStateColor = (state: Order['state']) => {
  switch (state) {
    case 'SAILING':
      return 'orange';
    case 'PLANNED':
      return 'blue';
    case 'CREATED':
      return 'gray';
    case 'ARRIVED':
      return 'green';
    case 'CLOSED':
      return 'red';
    case 'LOADED':
      return 'violet';
    default:
      return 'gray';
  }
};

const getTransportTypeColor = (state: Order['transportType']) => {
  switch (state) {
    case 'IMPORT':
      return 'blue';
    case 'EXPORT':
      return 'pink';
    default:
      return 'gray';
  }
};

export const OrderListPage: FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const { t } = useTranslation();

  const {
    data: orders,
    status,
    error,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: () =>
      doApiAction<Order[]>({
        endpoint: '/orders/all',
        method: 'GET',
      }),
  });

  if (status === 'pending') {
    return <div>{t('orderListPage:loading')}</div>;
  }

  if (status === 'error') {
    return (
      <div>
        {t('orderListPage:error')} | {error.message}
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
                return <Badge color={getStateColor(value)}>{value}</Badge>;
              },
            },
            {
              key: 'transportType',
              transform: (value: Order['transportType']) => {
                return (
                  <Badge color={getTransportTypeColor(value)}>{value}</Badge>
                );
              },
            },
            {
              key: 'portOfOriginCode',
            },
            {
              key: 'portOfDestinationCode',
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
          ]}
          data={orders ?? []}
        />
      </div>
    </div>
  );
};
