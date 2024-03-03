import { useQuery } from '@tanstack/react-query';
import { Table, TableData } from '@mantine/core';
import { doApiAction } from '@/lib/api';
import { FC } from 'react';

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
  const {
    data: userRequestListValues,
    status,
    error
  } = useQuery({refetchOnWindowFocus: false,
  queryKey: ['userRequestListValues'],
  queryFn: () => doApiAction<UserRequestListValues[]>({
    endpoint: '/user_requests',
    method: 'GET',
  })});

  if (status === 'pending') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>Error: {error.message}</div>;
  }

  const tableData: TableData = {
    head: ['Follow ID', 'Company Name', 'Created On', 'VAT Number', 'Contact Person', 'Options'],
    body: userRequestListValues.map((userRequestListValue) => [
      `#${userRequestListValue.followId}`,
      userRequestListValue.companyName,
      userRequestListValue.createdOn,
      userRequestListValue.vatNr,
      `${userRequestListValue.firstName} ${userRequestListValue.lastName}`,
      'Buttons',
    ]),
  };

  return (
      <Table stickyHeader striped data={tableData}/>
  );
}