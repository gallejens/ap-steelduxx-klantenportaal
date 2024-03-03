import { useQuery } from '@tanstack/react-query';
import { Table, Tabs } from '@mantine/core';
import { doApiAction } from '@/lib/api';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { dateConverter } from '@/lib/util/dateConverter';

type UserRequestListValues = {
  followId: number;
  companyName: string;
  createdOn: number;
  vatNr: string;
  firstName: string;
  lastName: string;
  status: string;
};
interface UserRequestTableProps {
  pageSize: number;
}

export const UserRequestTable: FC<UserRequestTableProps> = ({ pageSize }) => {
  const { t } = useTranslation();
  const statuses = ['PENDING', 'APPROVED', 'DENIED'];

  const {
    data: userRequestListValues,
    status,
    error,
  } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['userRequestListValues'],
    queryFn: () =>
      doApiAction<UserRequestListValues[]>({
        endpoint: '/user_requests',
        method: 'GET',
      }),
  });

  // TODO Fix handling
  if (status === 'pending') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>Error: {error.message}</div>;
  }

  const tableHead = [
    t('user_request_list_page:tableHeader0'),
    t('user_request_list_page:tableHeader1'),
    t('user_request_list_page:tableHeader2'),
    t('user_request_list_page:tableHeader3'),
    t('user_request_list_page:tableHeader4'),
    t('user_request_list_page:tableHeader5'),
  ];

  const generateTableData = (status: string) => ({
    head: tableHead,
    body: userRequestListValues
      .filter(userRequestListValue => userRequestListValue.status === status)
      .slice(0, pageSize)
      .map(userRequestListValue => [
        `#${userRequestListValue.followId}`,
        userRequestListValue.companyName,
        dateConverter(userRequestListValue.createdOn),
        userRequestListValue.vatNr,
        `${userRequestListValue.firstName} ${userRequestListValue.lastName}`,
        'Buttons',
      ]),
  });

  return (
    <Tabs
      defaultValue={statuses[0]}
      variant='outline'
    >
      <Tabs.List>
        {statuses.map(status => (
          <Tabs.Tab
            key={status}
            value={status}
            leftSection={
              status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
            }
          />
        ))}
      </Tabs.List>

      {statuses.map(status => (
        <Tabs.Panel
          key={status}
          value={status}
        >
          <Table
            stickyHeader
            striped
            horizontalSpacing='xl'
            verticalSpacing='sm'
            data={generateTableData(status)}
          />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};
