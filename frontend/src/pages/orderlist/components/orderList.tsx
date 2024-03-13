import { type FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { doApiAction } from '@/lib/api';
import { Table } from '@/components/table';
import { useTranslation } from 'react-i18next';

export const OrderList: FC = () => {
  // function getStateColor(state: Order['state']): string {
  //   switch (state) {
  //     case 'SAILING':
  //       return 'orange';
  //     case 'PLANNED':
  //       return 'blue';
  //     case 'CREATED':
  //       return 'gray';
  //     case 'ARRIVED':
  //       return 'green';
  //     case 'CLOSED':
  //       return 'red';
  //     case 'LOADED':
  //       return 'violet';
  //     default:
  //       return 'gray';
  //   }
  // }
  // const transformOrdersToTableData = (orders: Order[]) => {
  //   const head = [
  //     'Reference Number',
  //     'Customer Reference Number',
  //     'State',
  //     'Transport Type',
  //     'Port of Origin',
  //     'Port of Destination',
  //     'Ship Name',
  //     'ETS',
  //     'ATS',
  //     'ETA',
  //     'ATA',
  //   ];
  //   const body = orders.map(order => [
  //     order.referenceNumber,
  //     order.customerReferenceNumber,
  //     <Badge
  //       color={getStateColor(order.state)}
  //       key={order.state}
  //     >
  //       {order.state}
  //     </Badge>,
  //     <Badge
  //       color={order.transportType === 'IMPORT' ? 'blue' : 'pink'}
  //       key={order.transportType}
  //     >
  //       {order.transportType}
  //     </Badge>,
  //     order.portOfOriginCode,
  //     order.portOfDestinationCode,
  //     order.shipName,
  //     <Text
  //       style={{ fontStyle: 'italic', opacity: 0.7 }}
  //       key={`${order.referenceNumber}-ets`}
  //     >
  //       {order.ets ?? 'N/A'}
  //     </Text>,
  //     <Text
  //       style={{ fontStyle: 'italic', opacity: 0.7 }}
  //       key={`${order.referenceNumber}-ats`}
  //     >
  //       {order.ats ?? 'N/A'}
  //     </Text>,
  //     <Text
  //       style={{ fontStyle: 'italic', opacity: 0.7 }}
  //       key={`${order.referenceNumber}-eta`}
  //     >
  //       {order.eta ?? 'N/A'}
  //     </Text>,
  //     <Text
  //       style={{ fontStyle: 'italic', opacity: 0.7 }}
  //       key={`${order.referenceNumber}-ata`}
  //     >
  //       {order.ata ?? 'N/A'}
  //     </Text>,
  //   ]);
  //   return { head, body };
  // };
};
