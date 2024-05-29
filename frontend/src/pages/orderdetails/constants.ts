import type { OrderDetails, OrderDocumentType, OrderState } from '@/types/api';

export const ORDER_DOCUMENT_TYPE_TO_ORDERDETAIL_KEY: Record<
  OrderDocumentType,
  keyof OrderDetails
> = {
  bl: 'billOfLadingDownloadLink',
  packing: 'packingListDownloadLink',
  customs: 'customsDownloadLink',
};

export const SHOULD_SHOW_MAP_STATES = new Set<OrderState>([
  'SAILING',
  'LOADED',
]);
