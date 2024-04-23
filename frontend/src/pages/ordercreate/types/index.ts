import type { OrderDocumentType } from '@/types/api';

export type CreateOrderDocument = {
  type: OrderDocumentType;
  file: File;
};
