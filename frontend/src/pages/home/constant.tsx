import type { Auth } from '@/types/auth';
import type { RGB } from '@/types/util';

import {
  type TablerIconsProps,
  IconUserPlus,
  IconFilePlus,
  IconFiles,
  IconListDetails,
} from '@tabler/icons-react';
import type { FC } from 'react';

export const CARDS: {
  labelKey: string;
  path: `/app/${string}`;
  icon: FC<TablerIconsProps>;
  color: RGB;
  requiredPermission?: Auth.Permission;
}[] = [
  {
    labelKey: 'orders',
    path: '/app/orders',
    icon: IconFiles,
    color: { r: 36, g: 244, b: 112 },
  },
  {
    labelKey: 'orderrequests',
    path: '/app/order-requests',
    icon: IconFilePlus,
    color: { r: 205, g: 98, b: 0 },
    requiredPermission: 'MANAGE_ORDER_REQUESTS',
  },
  {
    labelKey: 'requests',
    path: '/app/requests',
    icon: IconUserPlus,
    color: { r: 219, g: 38, b: 183 },
    requiredPermission: 'MANAGE_USER_REQUESTS',
  },
  {
    labelKey: 'companies',
    path: '/app/companies',
    icon: IconListDetails,
    color: { r: 219, g: 38, b: 38 },
    requiredPermission: 'VIEW_COMPANIES',
  },
];
