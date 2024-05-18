import type { OrderDocumentType } from '@/types/api';

export const ACCEPTED_DOCUMENT_FILETYPES = 'application/pdf';
export const MAX_DOCUMENT_FILESIZE = 10 * 1024 * 1024; // 10mb

export const ORDER_DOCUMENT_TYPES: Record<OrderDocumentType, string> = {
  bl: 'Bill of Lading',
  packing: 'Packing List',
  customs: 'Customs Declaration',
};
