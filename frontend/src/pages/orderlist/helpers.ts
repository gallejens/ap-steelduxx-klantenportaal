import type { OrderState, OrderTransportType } from '@/types/api';

export const getOrderStateColor = (state: OrderState) => {
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

export const getOrderTransportTypeColor = (state: OrderTransportType) => {
  switch (state) {
    case 'IMPORT':
      return 'blue';
    case 'EXPORT':
      return 'pink';
    default:
      return 'gray';
  }
};
