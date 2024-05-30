import type { ProductContainerSize, ProductContainerType } from './types/api';

export const EMAIL_PLACEHOLDER = 'info@steelduxx.eu';
export const PASSWORD_PLACEHOLDER = '********';

export const PRODUCT_CONTAINER_SIZES: ProductContainerSize[] = ['20', '40'];

export const PRODUCT_CONTAINER_TYPES: Record<ProductContainerType, string> = {
  OT: 'OT (Open Top)',
  FT: 'FT (Flat Rack)',
  DV: 'DV (Dry Van)',
  HC: 'HC (High Cube)',
  RF: 'RF (Reefer)',
};
