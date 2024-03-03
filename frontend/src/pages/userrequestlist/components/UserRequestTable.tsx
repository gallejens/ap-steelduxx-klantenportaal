import { useQuery } from '@tanstack/react-query';
import { Table, TableData } from '@mantine/core';
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

export const UserRequestTable: FC = () => {
  const { t } = useTranslation();

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

  if (status === 'pending') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>Error: {error.message}</div>;
  }

  const tableData: TableData = {
    head: [
      t('user_request_list_page:tableHeader0'),
      t('user_request_list_page:tableHeader1'),
      t('user_request_list_page:tableHeader2'),
      t('user_request_list_page:tableHeader3'),
      t('user_request_list_page:tableHeader4'),
      t('user_request_list_page:tableHeader5'),
    ],
    body: userRequestListValues.map(userRequestListValue => [
      `#${userRequestListValue.followId}`,
      userRequestListValue.companyName,
      dateConverter(userRequestListValue.createdOn),
      userRequestListValue.vatNr,
      `${userRequestListValue.firstName} ${userRequestListValue.lastName}`,
      'Buttons',
    ]),
  };

  return (
    <Table
      stickyHeader
      striped
      horizontalSpacing='xl'
      verticalSpacing='sm'
      data={tableData}
    />
  );
};
