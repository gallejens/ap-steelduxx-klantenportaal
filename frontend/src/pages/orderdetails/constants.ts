import type { OrderDetails, OrderDocumentType } from '@/types/api';

export const ORDER_DOCUMENT_TYPE_TO_ORDERDETAIL_KEY: Record<
  OrderDocumentType,
  keyof OrderDetails
> = {
  bl: 'billOfLadingDownloadLink',
  packing: 'packingListDownloadLink',
  customs: 'customsDownloadLink',
};
