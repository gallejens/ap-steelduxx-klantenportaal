import type {
  OrderDocumentType,
  ProductContainerSize,
  ProductContainerType,
} from '@/types/api';

export const PRODUCT_CONTAINER_SIZES: ProductContainerSize[] = ['20', '40'];

export const PRODUCT_CONTAINER_TYPES: Record<ProductContainerType, string> = {
  OT: 'OT (Open Top)',
  FT: 'FT (Flat Rack)',
  DV: 'DV (Dry Van)',
  HC: 'HC (High Cube)',
  RF: 'RF (Reefer)',
};

export const DEFAULT_PORT_CODE = 'BEANR';
