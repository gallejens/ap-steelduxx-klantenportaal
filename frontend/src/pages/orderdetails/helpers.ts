import type { ProductContainerType } from '@/types/api';

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
