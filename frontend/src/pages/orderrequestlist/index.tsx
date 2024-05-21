import { type FC, useState } from 'react';
import { ActionIcon, Tabs } from '@mantine/core';
import { Table } from '@/components/table';
import { doApiAction } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { STATUSES } from './constants';
import styles from './styles/orderRequestList.module.scss';
import type { OrderRequest } from '@/types/api';
import { IconArrowRight } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { MultiSearch } from '@/components/multisearch';
import LoaderComponent from '@/components/loader';

export const OrderRequestListPage: FC = () => {
  const navigate = useNavigate();
  const [searchValues, setSearchValues] = useState<string[]>([]);
  const { data: orderRequests, status } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['orderRequestListValues'],
    queryFn: () =>
      doApiAction<OrderRequest[]>({
        endpoint: '/order-requests/all',
        method: 'GET',
      }),
  });

  if (status === 'pending' || status === 'error' || orderRequests == null) {
    return <LoaderComponent />;
  }

  const tableData = Object.values(orderRequests).reduce<
    Partial<
      Record<
        OrderRequest['status'],
        {
          id: string;
          companyName: string;
          transportType: string;
          portOfOriginCode: string;
          portOfDestinationCode: string;
          navigate: JSX.Element;
        }[]
      >
    >
  >((acc, orderRequest) => {
    const requestsForStatus = (acc[orderRequest.status] ??= []);
    requestsForStatus.push({
      id: `#${orderRequest.id}`,
      companyName: orderRequest.companyName,
      transportType: orderRequest.transportType,
      portOfOriginCode: orderRequest.portOfOriginCode,
      portOfDestinationCode: orderRequest.portOfDestinationCode,
      navigate: (
        <ActionIcon>
          <IconArrowRight
            key={`value_${orderRequest.id}`}
            onClick={() => {
              navigate({
                to: '/app/order-requests/$orderrequestid',
                params: {
                  orderrequestid: orderRequest.id,
                },
              });
            }}
          />
        </ActionIcon>
      ),
    });
    return acc;
  }, {});

  return (
    <div className={styles.orderrequest_list_page}>
      <div className={styles.header}>
        <MultiSearch
          onChange={newValues => setSearchValues(newValues)}
          inputWidth='30rem'
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
              leftSection={t(`orderRequestListPage:tabs:${status}`)}
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
              searchValue={searchValues}
              storageKey='orderrequest_list'
              translationKey='orderRequestListPage:table'
              columns={[
                { key: 'id', defaultSort: true },
                { key: 'companyName', initialWidth: 200 },
                { key: 'transportType', initialWidth: 150 },
                { key: 'portOfOriginCode', initialWidth: 150 },
                { key: 'portOfDestinationCode', initialWidth: 150 },
                {
                  key: 'navigate',
                  emptyHeader: true,
                  initialWidth: 50,
                  disallowSorting: true,
                  disableResizing: true,
                },
              ]}
              data={tableData[status] ?? []}
            />
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
};
