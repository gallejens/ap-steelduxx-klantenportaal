import type {
  OrderDetails,
  OrderDocumentType,
  ProductContainerType,
} from '@/types/api';
import { ORDER_DOCUMENT_TYPE_TO_ORDERDETAIL_KEY } from './constants';

export const transformProductContainerType = (
  productContainerType: ProductContainerType
) => {
  switch (productContainerType) {
    case 'OT':
      return 'Open Top';
    case 'FT':
      return 'Flat Top';
    case 'DV':
      return 'Dry Van';
    case 'HC':
      return 'High Cube';
    case 'RF':
      return 'Reefer';
    default:
      return 'null';
  }
};

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
