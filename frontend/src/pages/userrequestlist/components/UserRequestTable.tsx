import { useQuery } from '@tanstack/react-query';
import { Pagination, Table, Tabs } from '@mantine/core';
import { doApiAction } from '@/lib/api';
import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dateConverter } from '@/lib/util/dateConverter';
import { statuses } from '../constants';
import styles from '../styles/userRequestList.module.scss';

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
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const { data: userRequestListValues, status } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['userRequestListValues'],
    queryFn: () =>
      doApiAction<UserRequestListValues[]>({
        endpoint: '/user_requests',
        method: 'GET',
      }),
  });

  if (status === 'pending' || status === 'error') {
    return (
      <div className={styles.table_handling}>
        {status === 'pending' && t('user_request_list_page:tableLoading')}
        {status === 'error' && t('user_request_list_page:tableError')}
      </div>
    );
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
      .slice((currentPage - 1) * pageSize, currentPage * pageSize)
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

          <Pagination
            className={styles.pagination}
            total={Math.ceil(
              userRequestListValues.filter(
                userRequestListValue => userRequestListValue.status === status
              ).length / pageSize
            )}
            value={currentPage}
            onChange={handlePageChange}
            withEdges
          />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};
