import type { OrderDetails, OrderDocumentType } from '@/types/api';
import { ORDER_DOCUMENT_TYPE_TO_ORDERDETAIL_KEY } from './constants';

export const buildDocumentsFromOrderDetails = (orderDetails: OrderDetails) => {
  return Object.entries(ORDER_DOCUMENT_TYPE_TO_ORDERDETAIL_KEY).reduce(
    (acc, [type, detailsKey]) => {
      acc[type as OrderDocumentType] =
        orderDetails[detailsKey] !== null
          ? `${orderDetails.referenceNumber}-${type}.pdf`
          : null;
      return acc;
    },
    {} as Record<OrderDocumentType, string | null>
  );
};
