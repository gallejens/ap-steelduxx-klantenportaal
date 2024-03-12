import { type FC, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { dateConverter } from '@/lib/util/dateConverter';
import { doApiAction } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Pagination, Table, Tabs } from '@mantine/core';
import styles from '../styles/userRequestList.module.scss';
import { statuses } from '../constants';

type UserRequestListValues = {
  followId: number;
  companyName: string;
  createdOn: number;
  vatNr: string;
  firstName: string;
  lastName: string;
  status: string;
  [key: string]: number | string;
};

interface UserRequestTableProps {
  pageSize: number;
  searchTerm: string;
}

export const UserRequestTable: FC<UserRequestTableProps> = ({ pageSize, searchTerm }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<{ column: string; direction: 'asc' | 'desc' }>({
    column: 'createdOn',
    direction: 'asc',
  });

  const { data: allUserRequestListValues, status } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['userRequestListValues'],
    queryFn: () =>
      doApiAction<UserRequestListValues[]>({
        endpoint: '/user_requests',
        method: 'GET',
      }),
  });
  
  const userRequestListValues = useMemo(() => {
    if (!allUserRequestListValues || !searchTerm) {
      return allUserRequestListValues;
    }
  
    return allUserRequestListValues.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [allUserRequestListValues, searchTerm]);
  
  if (status === 'pending' || status === 'error' || userRequestListValues == null) {
    return (
      <div className={styles.table_handling}>
        {status === 'pending' && t('user_request_list_page:tableLoading')}
        {status === 'error' && t('user_request_list_page:tableError')}
      </div>
    );
  }

  const tableHead = [
    t('user_request_list_page:tableHeader0'),
    <>
      {t('user_request_list_page:tableHeader1')}
      <span onClick={() => handleSortToggle('companyName')}>
        {sort.column === 'companyName' ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    </>,
    <>
      {t('user_request_list_page:tableHeader2')}
      <span onClick={() => handleSortToggle('createdOn')}>
        {sort.column === 'createdOn' ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    </>,
    t('user_request_list_page:tableHeader3'),
    t('user_request_list_page:tableHeader4'),
    t('user_request_list_page:tableHeader5'),
  ];

  const generateTableData = (status: string) => ({
    head: tableHead,
    body: userRequestListValues
      .filter((userRequestListValue) => userRequestListValue.status === status)
      .sort((a, b) => {
        const aValue = a[sort.column];
        const bValue = b[sort.column];

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sort.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        return 0;
      })
      .slice((currentPage - 1) * pageSize, currentPage * pageSize)
      .map((userRequestListValue) => [
        `#${userRequestListValue.followId}`,
        userRequestListValue.companyName,
        dateConverter(userRequestListValue.createdOn),
        userRequestListValue.vatNr,
        `${userRequestListValue.firstName} ${userRequestListValue.lastName}`,
        'Buttons',
      ]),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortToggle = (column: string) => {
    setSort((prevSort) => ({
      column,
      direction: prevSort.column === column && prevSort.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

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
